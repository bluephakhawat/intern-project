import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import axios from "axios";
import './Style.css';

const Data_Table = () => {

    // Api

    const [api_data, setApi_data] = useState([]);
    const [total_data, setTotal_data] = useState([]);
    useEffect(() => {
        axios
            .get("http://localhost:3300/realtime_db")
            .then((res) => {
                setApi_data(res.data)
                setTotal_data(res.data)
            });
    }, []);

    // setItems 

    const items = api_data.map(e => {
        if (e.firmware_current === e.firmware_update) {
            return { ...e, status: "available" };
        }
        else {
            return { ...e, status: "unavailable" };
        }
    })

    const items2 = total_data.map(e => {
        if (e.firmware_current === e.firmware_update) {
            return { ...e, status: "available" };
        }
        else {
            return { ...e, status: "unavailable" };
        }
    })

    console.log(api_data)
    console.log(api_data[0])

    // Toast

    const toast = useRef(null);

    // Multiple Filtered IMEI

    const [mul_filtered_imei, setMul_filtered_imei] = useState('')
    const object = mul_filtered_imei.split("\n")
    const count_object = object.length
    const Func_mul_filtered_imei = (e) => {
        setMul_filtered_imei(e.target.value)
    }
    const Confirm_button = () => {
        if (mul_filtered_imei == '') {
            toast.current.show({ severity: 'error', summary: 'Filtered Error', detail: 'please input imei in the message box.', life: 2000 });
        }
        else if (count_object > 5000) {
            toast.current.show({ severity: 'error', summary: 'Filtered Error', detail: 'please input imei less than 5000.', life: 2000 });
        }
        else {
            const x = {
                config: object
            }
            axios
                .post("http://localhost:3300/realtime_db/mul_imei", (x))
                .then((res) => {
                    setApi_data(res.data)
                });
            toast.current.show({ severity: 'success', summary: 'Filtered Success', detail: 'imei has been filtered.', life: 2000 });
        }

    }
    const Clear_button = () => {
        axios
            .get("http://localhost:3300/realtime_db")
            .then((res) => {
                setApi_data(res.data)
            });
        setMul_filtered_imei('')
        toast.current.show({ severity: 'success', summary: 'Clear Success', detail: 'imei has been cleared', life: 2000 });
    }
    const Render_mul = () => {
        if (count_object - 1 == 0) {
            return (
                <div className="flex">
                    <text class="dt">Filtered Count : 0 / 5000 </text>
                </div>
            )
        }
        else if (count_object <= 5000) {
            return (
                <div className="flex">
                    <text class="green dt">Filtered Count : {count_object - 1} / 5000 </text>
                </div>
            )
        }
        else {
            return (
                <div className="flex">
                    <text class="red dt">Filtered Count : {count_object - 1} / 5000 </text>
                </div>
            )
        }
    }
    const mul = Render_mul();

    // ACC CHECK

    const count_acc_on = total_data.filter(e => {
        if (e.acc == "1") {
            return e
        }
    })
    const count_acc_off = total_data.filter(e => {
        if (e.acc == "0") {
            return e
        }
    })

    // STATUS CHECK

    const count_status_on = items2.filter(e => {
        if (e.status == "available") {
            return e
        }
    })
    const count_status_off = items2.filter(e => {
        if (e.status == "unavailable") {
            return e
        }
    })

    // Filter Global

    const [filter_global, setFilter_global] = useState('');
    const Receive_global = (e) => {
        const input_global = {
            config_global: e.target.value
        }
        axios
            .post("http://localhost:3300/realtime_db/global", (input_global))
            .then((res) => {
                setApi_data(res.data)
            });
        setFilter_global(e.target.value)
    }

    // Filter IMEI

    const [filter_imei, setFilter_imei] = useState('');
    const Receive_imei = (e) => {
        const input_imei = {
            config_imei: e.target.value,
            config_mid: filter_mid,
            config_ccid: filter_ccid,
            config_vehiclemodel: filter_vehiclemodel,
            config_acc: filter_acc,
            config_firmware_current: filter_firmware_current,
            config_status: status
        }
        axios
            .post("http://localhost:3300/realtime_db/imei", (input_imei))
            .then((res) => {
                setApi_data(res.data)
            });
        setFilter_imei(e.target.value)
    }

    // Filter MID

    const [filter_mid, setFilter_mid] = useState('');
    const Receive_mid = (e) => {
        const input_mid = {
            config_mid: e.target.value,
            config_imei: filter_imei,
            config_ccid: filter_ccid,
            config_vehiclemodel: filter_vehiclemodel,
            config_acc: filter_acc,
            config_firmware_current: filter_firmware_current,
            config_status: status
        }
        axios
            .post("http://localhost:3300/realtime_db/mid", (input_mid))
            .then((res) => {
                setApi_data(res.data)
            });
        setFilter_mid(e.target.value)
    }

    // Filter CCID

    const [filter_ccid, setFilter_ccid] = useState('');
    const Receive_ccid = (e) => {
        const input_ccid = {
            config_ccid: e.target.value,
            config_imei: filter_imei,
            config_mid: filter_mid,
            config_vehiclemodel: filter_vehiclemodel,
            config_acc: filter_acc,
            config_firmware_current: filter_firmware_current,
            config_status: status
        }
        axios
            .post("http://localhost:3300/realtime_db/ccid", (input_ccid))
            .then((res) => {
                setApi_data(res.data)
            });
        setFilter_ccid(e.target.value)
    }

    // Filter Vehiclemodel

    const [filter_vehiclemodel, setFilter_vehiclemodel] = useState('');
    const Receive_vehiclemodel = (e) => {
        const input_vehiclemodel = {
            config_vehiclemodel: e.target.value,
            config_imei: filter_imei,
            config_mid: filter_mid,
            config_ccid: filter_ccid,
            config_acc: filter_acc,
            config_firmware_current: filter_firmware_current,
            config_status: status
        }
        axios
            .post("http://localhost:3300/realtime_db/vehiclemodel", (input_vehiclemodel))
            .then((res) => {
                setApi_data(res.data)
            });
        setFilter_vehiclemodel(e.target.value)
    }

    // Filter ACC

    const [filter_acc, setFilter_acc] = useState('');
    const Receive_acc = (e) => {
        const input_acc = {
            config_acc: e.target.value,
            config_imei: filter_imei,
            config_mid: filter_mid,
            config_ccid: filter_ccid,
            config_vehiclemodel: filter_vehiclemodel,
            config_firmware_current: filter_firmware_current,
            config_status: status
        }
        axios
            .post("http://localhost:3300/realtime_db/acc", (input_acc))
            .then((res) => {
                setApi_data(res.data)
            });
        setFilter_acc(e.target.value)
        setSl_acc(e.value)
    }

    // Filter Status Check

    const [status, setStatus] = useState('');
    const Receive_status = (e) => {
        const input_status = {
            config_status: e.target.value,
            config_imei: filter_imei,
            config_mid: filter_mid,
            config_ccid: filter_ccid,
            config_vehiclemodel: filter_vehiclemodel,
            config_acc: filter_acc,
            config_firmware_current: filter_firmware_current
        }
        axios
            .post("http://localhost:3300/realtime_db/status", (input_status))
            .then((res) => {
                setApi_data(res.data)
            });
        setStatus(e.value)
    }
    const status_option = [
        { label: 'available', value: 'available' },
        { label: 'unavailable', value: 'unavailable' }
    ];
    const Statusbody = (rowData) => {
        return <span className={`customer-badge status-${rowData.status}`}>{rowData.status}</span>;
    }
    const Render_status = () => {
        return <Dropdown value={status} options={status_option} onChange={Receive_status} placeholder="Select a Status" />;
    }

    // Filter Current Firmware Version

    const [filter_firmware_current, setFilter_firmware_current] = useState('');
    const Receive_firmware_current = (e) => {
        const input_firmware_current = {
            config_firmware_current: e.target.value,
            config_imei: filter_imei,
            config_mid: filter_mid,
            config_ccid: filter_ccid,
            config_vehiclemodel: filter_vehiclemodel,
            config_acc: filter_acc,
            config_status: status
        }
        axios
            .post("http://localhost:3300/realtime_db/firmware_current", (input_firmware_current))
            .then((res) => {
                setApi_data(res.data)
            });
        setFilter_firmware_current(e.target.value)
        setConfig(e.value)
    }
    const Cfv_filter_Body = (rowData) => {
        return <span>{rowData.firmware_current}</span>;
    }

    // Firmware Selection

    const [version, setVersion] = useState(null);
    const [config, setConfig] = useState(null);
    const [sl_acc, setSl_acc] = useState(null);
    const Acc_SelectItems = [
        { label: '0', value: '0' },
        { label: '1', value: '1' }
    ];
    const [list_cfv, setList_cfv] = useState([]);
    useEffect(() => {
        axios
            .get("http://localhost:3300/realtime_db/cfv")
            .then((res) => {
                setList_cfv(res.data)
            });
    }, []);
    const use_list_cfv = list_cfv.map(e => {
        return { label: e.firmware_current, value: e.firmware_current }
    })
    const Input_select = (x) => {
        return x = version
    }

    // Render filter

    const Render_filter_global = () => {
        return (
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={filter_global} onChange={Receive_global} placeholder="Search By Global"></InputText>
            </span>
        )
    }
    const global_text = Render_filter_global()
    const Render_filter_imei = () => {
        return (
            <InputText value={filter_imei} onChange={Receive_imei} placeholder="Search By IMEI"></InputText>
        )
    }
    const Render_filter_mid = () => {
        return (
            <InputText value={filter_mid} onChange={Receive_mid} placeholder="Search By MID"></InputText>
        )
    }
    const Render_filter_ccid = () => {
        return (
            <InputText value={filter_ccid} onChange={Receive_ccid} placeholder="Search By CCID"></InputText>
        )
    }
    const Render_filter_vehiclemodel = () => {
        return (
            <InputText value={filter_vehiclemodel} onChange={Receive_vehiclemodel} placeholder="Search By Vehiclemodel"></InputText>
        )
    }
    const Render_filter_acc = () => {
        return (
            <Dropdown value={sl_acc} options={Acc_SelectItems} onChange={Receive_acc} placeholder="Select ACC"></Dropdown>
        )
    }
    const Render_filter_firmware_current = () => {
        return (
            <Dropdown value={config} options={use_list_cfv} onChange={Receive_firmware_current} placeholder="Select Version"></Dropdown>
        )
    }
    const Render_config = () => {
        return (
            <Dropdown value={version} options={use_list_cfv} onChange={(e) => setVersion(e.value)} placeholder="Select Version" />
        )
    }

    // Function Check_filter_found

    const Func_count_filter_found = () => {
        if (filter_global == '' && filter_imei == '' && filter_mid == '' && filter_ccid == '' && filter_vehiclemodel == '' && filter_firmware_current == '' && filter_acc == '' && status == '' && mul_filtered_imei == '') {
            return '-'
        }
        else {
            return api_data.length;
        }
    }
    const count_filter_found = Func_count_filter_found()

    // Clear Filter

    const ClearFilter = () => {
        InitFilters();
        axios
            .get("http://localhost:3300/realtime_db")
            .then((res) => {
                setApi_data(res.data)
            });
    }
    const InitFilters = () => {
        setFilter_global('');
        setFilter_imei('');
        setFilter_mid('');
        setFilter_ccid('');
        setFilter_vehiclemodel('');
        setFilter_firmware_current('');
        setFilter_acc('');
        setStatus('')
        setSl_acc(null);
        setConfig(null);
        setVersion(null);
    }
    const Renderclear = () => {
        return (
            <div>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={ClearFilter} />
            </div>
        )
    }
    const clear_filter = Renderclear()

    // Sending

    const Sending = () => {
        for (let i = 0; i < items.length; i++) {
            const a = [items[i]]
            const config = {
                id: a,
                version: version
            }
            axios
                .put("http://localhost:3300/realtime_db/update", (config))
        }
        toast.current.show({ severity: 'success', summary: 'Update Success', detail: 'data has been updated successfully', life: 2000 });
    }

    // Button Update All

    const Button_Update = () => {
        const [visible, setVisible] = useState()
        const [reject, setReject] = useState()
        const count_selectlist = api_data.length
        const Error_version = () => {
            toast.current.show({ severity: 'error', summary: 'Error Update', detail: 'please select version to update.', life: 2000 });
        }
        const Error_less = () => {
            toast.current.show({ severity: 'error', summary: 'Error Update', detail: 'please filter update list less than 5000.', life: 2000 });
        }
        const message = () => {
            return (
                <>
                    Firmware Version Selected : {version} <br />
                    Amount of Data Selected : {count_selectlist}
                </>
            )
        }
        if (version != null && count_selectlist > 0 && count_selectlist <= 5000) {
            return (
                <>
                    <Toast ref={toast} />
                    <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message={message}
                        header="Confirm Update" icon="pi pi-info-circle" accept={Sending} reject={reject} />
                    <Button label="All Update" onClick={() => setVisible(true)} className="p-button p-component p-button-outlined"></Button>
                </>
            )
        }
        else if (version == null) {
            return (
                <>
                    <Toast ref={toast} />
                    <Button label="Update All" onClick={Error_version} className="p-button p-component p-button-outlined"></Button>
                </>
            );
        }
        else {
            return (
                <>
                    <Toast ref={toast} />
                    <Button label="Update All" onClick={Error_less} className="p-button p-component p-button-outlined"></Button>
                </>
            );
        }
    }
    const button_update = Button_Update();

    // renderHeader

    const RenderHeader = () => {
        return (
            <div class="row dbal">
                <div class="col-6">
                    <div className="flex">
                        {global_text}
                        <div class="bl">
                            {clear_filter}
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div className="flex justify-content-end">
                        {button_update}
                    </div>
                </div>
            </div>
        )
    }
    const header = RenderHeader();
    return (
        <div class="datatable-filter-real">
            <Toast ref={toast} />
            <div class="row">
                <div class="col-3">
                    <text class="dt"><b>Multiple Filtered IMEI</b></text>
                    <div className="flex">
                        <InputTextarea rows={3} cols={42} value={mul_filtered_imei} onChange={Func_mul_filtered_imei}></InputTextarea>
                    </div>
                    {mul}
                    <div className="flex bottom2 top2">
                        <Button className="p-button-info" label="Filtered" onClick={Confirm_button} icon="pi pi-filter"></Button>
                        <Button className="bleft p-button-danger" label="Clear" onClick={Clear_button} icon="pi pi-filter-slash"></Button>
                    </div>
                </div>
                <div class="col-2">
                    <div className="top card bottom btu col">
                        <text class="dt"><b>Table View</b> : 10</text>
                        <text class="dt"><b>Filtered Found</b> : {count_filter_found}</text>
                        <text class="dt"><b>Data Total</b> : {total_data.length}</text>
                    </div>
                </div>
                <div class="col-2">
                    <div className="top card bottom btu col">
                        <text class="dt"><b>ACC Check</b></text>
                        <text class="dt"><b>ACC On</b> : {count_acc_on.length}</text>
                        <text class="dt"><b>ACC Off</b> : {count_acc_off.length}</text>
                    </div>
                </div>
                <div class="col-2">
                    <div className="top card bottom btu col">
                        <text class="dt"><b>Status Check</b></text>
                        <text class="dt"><b>Status On</b> : {count_status_on.length}</text>
                        <text class="dt"><b>Status Off</b> : {count_status_off.length}</text>
                    </div>
                </div>
                <div class="col-3">
                    <div class="d-grid d-md-flex justify-content-md-end">
                        <a href="http://localhost:3000/" >
                            <Button label="Refresh" className="p-button-success"></Button>
                        </a>
                    </div>
                </div>
            </div>

            <DataTable
                value={items}
                responsiveLayout="scroll"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowsPerPageOptions={[10, 50, 100, 200, 500, 1000]}
                dataKey="id"
                paginator
                emptyMessage="No data found."
                className="datatable-responsive"
                currentPageReportTemplate="Showing {first} to {last} of Filter Found : {totalRecords} data."
                rows={10}
                showGridlines
                filterDisplay="row"
                header={header}
                resizableColumns
                columnResizeMode="expand"
                paginatorPosition="bottom"
                alwaysShowPaginator
            >
                <Column field="imei" filter filterElement={Render_filter_imei} filterPlaceholder="Search by IMEI" sortable header="IMEI"></Column>
                <Column field="mid" filter filterElement={Render_filter_mid} filterPlaceholder="Search by MID" sortable header="MID"></Column>
                <Column field="ccid" filter filterElement={Render_filter_ccid} filterPlaceholder="Search by CCID" sortable header="CCID"></Column>
                <Column field="vehiclemodel" filter filterElement={Render_filter_vehiclemodel} filterPlaceholder="Search by Vehiclemodel" sortable header="Vehiclemodel"></Column>
                <Column field="acc" filter filterElement={Render_filter_acc} filterPlaceholder="Search by ACC" sortable header="ACC"></Column>
                <Column field="status" header="Status Check" body={Statusbody} filter filterElement={Render_status} />
                <Column field="firmware_current" header="Current Firmware Version" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={Cfv_filter_Body} filter filterElement={Render_filter_firmware_current} sortable />
                <Column body={Input_select} header="Configure" filter filterElement={Render_config}></Column>
            </DataTable>
        </div>
    )
};


export default Data_Table;