import Nav_bar from './components/Nav_bar';
import Data_Table from './components/Data_Table';
import './App.css';

function App() {
  return (
    <div>
      {
        <>
          <Nav_bar></Nav_bar>
          <div class="container-fluid">

            {/* row 1  */}
            <div class="row">
              {/* <div class="d-grid d-md-flex justify-content-md-end">
                <a href="http://localhost:3000/" >
                  <Button label="Refresh" className="p-button-danger"></Button>
                </a>
              </div> */}
              <div class="col">
                <Data_Table></Data_Table>
              </div>
              

            </div>

            {/* row 2 */}
            <div class="row">
              <div class="col">
                {/* row 2 col 1 */}
              </div>
            </div>

          </div>
        </>
      }
    </div>
  );
}

export default App;
