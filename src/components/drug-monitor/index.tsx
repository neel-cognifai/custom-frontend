"use client";
import React, { useState } from "react";
import AddDrugMonitor from "./AddDrugMonitor";
import ListDrugMonitor from "./ListDrugMonitor";

const DrugMonitor = () => {
  const [openAdd, setOPenAdd] = useState<boolean>(false);
  const [monitorId, setMonitorId] = useState<string>('');

  const handelOpen = () => {  
    setMonitorId('')
    setOPenAdd(true);
  };
  const handleClose = () => {    
    setOPenAdd(false);
    setMonitorId('')
  }
  const handleOpenEdit = ( monitorId: React.SetStateAction<string> ) => { 
    setOPenAdd(false);
    setMonitorId(monitorId)
    setOPenAdd(true);
  };
  return (
    <React.Fragment>

      <div className="main">
        <div className="add cursor-pointer">
          {!openAdd ? (
            <div className="basis-1/4  flex flex-col items-center justify-center">
              <button
                className="bg-yellow cursor-pointer px-4 py-3 w-40 text-white text-14 text-base font-archivo font-medium capitalize rounded"
                onClick={handelOpen}
              >
                + add monitor
              </button>
            </div>            
          ) : (
            <AddDrugMonitor
              handelClose={() => {
                handleClose();
              }}

              editMonitorId={monitorId}
            />
          )}
        </div>
        <div className="list">
          <ListDrugMonitor setOPenEdit={handleOpenEdit} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default DrugMonitor;
