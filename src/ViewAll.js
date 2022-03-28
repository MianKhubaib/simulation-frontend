import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { http, localHttp } from "./http-common.js";
import { useNavigate } from "react-router-dom";
export default function ViewAll() {
  const [bleData, setData] = useState(null);
  const [refreshDisabled, setRefreshDisable] = useState(true);
  const [execution, setExecution] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  let navigate = useNavigate();
  const cancelSimulationAll = async () => {
    setExecution(false);
    try {
      const res = await localHttp.post(`cancelSimulationAll`);
      console.log("Execution has been cancelled");
      setRefreshDisable(true);
    } catch (e) {
      console.log(e);
    }
  };

  const executeRepeatFunctionAll = async () => {
    setExecution(true);
    setRefreshDisable(true);
    setTimeout(() => {
      setRefreshDisable(false);
    }, 6000);
    try {
      console.log("Simulation is working");
      await localHttp.post(
        `simulateAll`,
        bleData.filter((item) => item.checked === true)
      );
      hangleUnSelectAll();
    } catch (e) {
      console.log(e);
    }
  };

  const handleOnChange = (position) => {
    const updatedCheckedState = bleData.map((item, index) => {
      if (index === position) {
        item.checked = !item.checked;
        return item;
      } else {
        return item;
      }
    });
    setData(updatedCheckedState);
  };

  const hangleSelectAll = () => {
    const updatedCheckedState = bleData.map((item, index) => {
      if (!item.checked) {
        item.checked = !item.checked;
      }
      return item;
    });
    setData(updatedCheckedState);
    setAllSelected(true);
  };

  const hangleUnSelectAll = () => {
    const updatedCheckedState = bleData.map((item, index) => {
      if (item.checked) {
        item.checked = !item.checked;
      }
      return item;
    });
    setData(updatedCheckedState);
    setAllSelected(false);
  };

  const getAll = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await http.get("/sensor/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const modifiedData = res.data.map((item) => {
        return { ...item, checked: false };
      });
      setData(modifiedData);
    } catch (e) {
      console.log(e);
    }
  };

  const hanglelogout = () => {
    localStorage.setItem("access_token", "");
    navigate("/view", { replace: true });
  };

  useEffect(() => {
    getAll();
  }, []);

  return (
    <div>
      <ul role="list" className="divide-y divide-gray-200">
        {!bleData && (
          <h1 className="w-30 grow f3 link ph3 pv2 bg-light-red tc center">
            Loading...
          </h1>
        )}

        <div className="ml-auto w-30">
          {!allSelected && (
            <button
              onClick={() => hangleSelectAll()}
              type="button"
              className="inline-flex mv1 mr-8 ml-4 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Select All
            </button>
          )}
          {allSelected && (
            <button
              onClick={() => hangleUnSelectAll()}
              type="button"
              className="inline-flex mv1 mr-8 ml-4 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Unselect All
            </button>
          )}
          <button
            onClick={() => hanglelogout()}
            type="button"
            className="inline-flex mv2 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Logout
          </button>
        </div>
        <div
          className="center "
          style={{
            overflowY: "scroll",
            height: "400px",
          }}
        >
          {bleData &&
            bleData.map((ble, index) => (
              <li
                key={ble.uid}
                className="relative bg-gray-100 py-5 px-4 w-1/2  mx-auto hover:bg-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 hover:cursor-pointer"
              >
                <label htmlFor={`custom-checkbox-${index}`} className="flex">
                  <div className="w-full mr-10">
                    <div className="flex justify-between space-x-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {ble.name}
                        </p>
                      </div>
                    </div>
                    <div className="mt-1">
                      <p className="line-clamp-2 text-sm text-gray-600">
                        {ble.uid}
                      </p>
                    </div>

                    <div className="flex justify-center"></div>
                  </div>
                  <div className="flex items-center hover:cursor-pointer">
                    <input
                      id={`custom-checkbox-${index}`}
                      aria-describedby="comments-description"
                      name={ble.name}
                      type="checkbox"
                      checked={ble.checked}
                      // value={ble.name}
                      onChange={() => handleOnChange(index)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded hover:cursor-pointer"
                    />
                  </div>
                </label>
              </li>
            ))}
        </div>
      </ul>
      <div className="mx-auto w-1/2 mt-12">
        <div className="flex justify-center items-center">
          {execution && (
            <button
              onClick={() => cancelSimulationAll()}
              type="button"
              className="bg-white py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => executeRepeatFunctionAll()}
            type="button"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Execute
          </button>

          {execution && (
            <div className="ml-2 p-2 bg-yellow-200 border border-yellow-500 rounded-lg">
              Execution in process
            </div>
          )}
          {/* {!refreshDisabled && <div className="ml-2 p-2 bg-green-200 border border-green-500 rounded-lg">New Data available</div>} */}
        </div>
      </div>
    </div>
  );
}
