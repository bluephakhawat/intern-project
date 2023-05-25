import pandas as pd
import psycopg2 as pg
import numpy as np
from datetime import datetime
import binascii
import collections
import socket
import time


def func_customize_realtime(x):
    x = x.get(["B.F"])  
    x = x.reset_index()
    x = x.rename(columns={"index": "imei", "B.F": "realtime_firmware_version"})
    x = x[x["imei"].str.contains("T015", regex=False)]
    return x


def func_compare_realtime(x, y):
    z = pd.merge(x, y, on="imei")
    check1 = z["realtime_firmware_version"] == z["current_firmware_version"]
    check1 = check1.to_frame()
    z.insert(3, "check", check1)
    z = z[z["check"] == False]
    z = z.drop(columns=["realtime_firmware_version", "check"])
    z = z.dropna()
    return z


def func_update(x):
    for i in x.to_numpy():
        imei = i[0]
        version = i[1]
        cursor.execute("""
            update realtime_db
            set firmware_current = '{}'
            where imei = '{}'
        """.format(version, imei))
        con.commit()


def func_compare_update(x):
    x = x.dropna()
    check2 = x["firmware_current"] == x["firmware_update"]
    check2 = check2.to_frame()
    x.insert(3, "check", check2)
    x = x[x["check"] == False]
    x = x.drop(columns=["check"])
    return x


def func_acc_check(x):
    check3 = x["acc"] == "1"
    check3 = check3.to_frame()
    x.insert(5, "check", check3)
    x = x[x["check"] == False]
    x = x.drop(columns=["check"])
    return x


def func_gsm_check(x):
    x["gsm"] = x["gsm"].astype(int)
    check4 = x["gsm"] < 20
    check4 = check4.to_frame()
    x.insert(5, "check", check4)
    x = x[x["check"] == False]
    x = x.drop(columns=["check"])
    return x


def func_imei_convert(x):
    x["imei_hex"] = x["imei"].map(lambda x: x.lstrip('T'))
    x["imei_hex"] = "54" + x["imei_hex"]
    return x


def func_firmware_config_convert(x):
    hex2 = x["firmware_update"]
    hex3 = ''
    for i in hex2.to_numpy():
        hex3 = hex3 + i.encode('utf-8').hex()
    hex3 = [hex3[i:i+28] for i in range(0, len(hex3), 28)]
    hex3 = pd.Series(hex3)
    return hex3


def func_comma_conver():
    comma = ","
    x = comma.encode('utf-8').hex()
    return x


def func_ftp_address_convert():
    address = "61.19.242.71"
    x = address.encode('utf-8').hex()
    return x


def func_ftp_port_convert():
    port = "21"
    x = port.encode('utf-8').hex()
    return x


def func_user_convert():
    user = "r10v2"
    x = user.encode('utf-8').hex()
    return x


def func_pw_convert():
    pw = "onelink@2012"
    x = pw.encode('utf-8').hex()
    return x


def func_bin_convert():
    bin = ".BIN"
    x = bin.encode('utf-8').hex()
    return x


def func_slash_convert():
    slash = "/"
    x = slash.encode('utf-8').hex()
    return x


def func_sumstr(x):
    comma = func_comma_conver()
    y = []
    for i in x.to_numpy():
        z = "8502"+"0047"+i[3]+"0001"+i[1]+comma+func_ftp_address_convert()+comma+func_ftp_port_convert()+comma+func_user_convert(
        )+comma+func_pw_convert()+comma+i[1]+func_bin_convert()+comma+func_slash_convert()+comma
        y.append(z)
    return y
def func_checksum_XOR(x):
    _items = list(binascii.unhexlify(x))
    counter = list(collections.Counter(_items).items())
    x = list(filter(lambda x: x[1] % 2 == 1, counter))
    b = [x[0] for x in x]
    result = b[0]
    for i in range(1, len(b)):
        result ^= b[i]
    return "{:02x}".format(result)


def func_compare_datetime(x):
    now = datetime.now().astimezone()
    now = int(round(now.timestamp()))
    x["serverdatetime"] = pd.to_datetime(x["serverdatetime"]).astype(np.int64)
    x["serverdatetime"] = x["serverdatetime"].astype(str)
    x["serverdatetime"] = x["serverdatetime"].str[0:10]
    x["serverdatetime"] = x["serverdatetime"].astype(int)
    dif = now - x["serverdatetime"]
    x["dif"] = dif
    check = x["dif"] <= 600
    check = check.to_frame()
    x["check"] = check
    x = x[x["check"] == False]
    x = x.drop(columns=["serverdatetime", "dif", "check"])
    return x


def func_main(x):
    x = func_compare_update(x)
    x = func_acc_check(x)
    x = func_gsm_check(x)
    x = x.drop(columns=["firmware_current", "acc", "gsm"])
    x = func_imei_convert(x)
    x = x.reset_index()
    x = x.drop(columns=["index"])
    fwc = func_firmware_config_convert(x)
    x["firmware_update"] = fwc
    sum_text = func_sumstr(x)
    x = x.rename(columns={"firmware_update": "message"})
    x["message"] = sum_text
    x = func_compare_datetime(x)
    z = []
    for i in x["message"].to_numpy():
        y = func_checksum_XOR(i)
        z.append(y)
    z = pd.Series(z)
    x["checksum"] = z
    x["message"] = "e7" + x["message"] + x["checksum"] + "e7"
    x = x.drop(columns=["checksum"])
    return x


df_rt = pd.read_pickle('realtime_dummy_v2.pkl')
df_rt = func_customize_realtime(df_rt)

con = pg.connect(host="localhost", database="postgres",
                 user="postgres", password="********", port=5432)
cursor = con.cursor()

df_db = pd.read_sql(
    """select imei,firmware_current from realtime_db where imei like 'T015%'""", con)
con.commit()
df_db = df_db.rename(columns={"firmware_current": "current_firmware_version"})


df_pc = func_compare_realtime(df_rt, df_db)
func_update(df_pc)

df_up = pd.read_sql(
    """select imei,firmware_current,firmware_update,acc,gsm,serverdatetime from realtime_db where imei like 'T015%'""", con)
con.commit()

df_up = func_main(df_up)
print(df_up)
# for i in df_up["message"]:
#     print(i)

# Sending Method

# for i in df_up.to_numpy():
#     imei = i[0]
#     dt = datetime.now().astimezone()
#     dt = datetime.strftime(dt, '%Y-%m-%d %H:%M:%S%z')
#     cursor.execute("""
#             update realtime_db
#             set serverdatetime = '{}'
#             where imei = '{}'
#         """.format(dt, imei))
#     con.commit()


