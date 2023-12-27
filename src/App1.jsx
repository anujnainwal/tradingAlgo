import React, { useState } from "react";
import { Button, SelectPicker, Input, Modal, Badge, Toggle } from "rsuite";
import "./App.css";
import TrashIcon from '@rsuite/icons/Trash';
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Logic from "./Components/Logic/Logic";


export default function App() {
  const [conditions, setConditions] = useState([]);
  const [showEntry, setShowEntry] = useState(true);
  const [showExit, setShowExit] = useState(true);
 
  const [open, setOpen] = useState(false);
  const [header, setHeader] = useState("");
  const [currentIndex, setCurrentIndex] = useState(null);
  const [fieldValue, setFieldValue] = useState(null);
  const [setShowMore, setShowMoreOptions] = useState(false);
  
  const fdata = [
    "Open",
    "Close",
    "High",
    "Low",
    "Volume",
    "RSI",
    "SMA",
    "RMA",
    "EMA",
    "ATR",
    "TR",
    "Number",
  ];
  
  const data = fdata.map((item) => ({
    label: item,
    value: item,
    role: item === 'Number' ? 'Number' : fdata.indexOf(item) <= fdata.indexOf('Volume') ? 'Stock Attributes' : 'Indicators',
  }));
  

  const arithmeticOperators = [
    "+",
    "-",
    "x", 
    "÷",
  ].map((item) => ({
    label: item,
    value: item,
  }));
  

  const conditionalOperator = [
    "GreaterThan",
    "GreaterThanEqualTo",
    "LessThan",
    "LessThanEqualTo",
    "EqualTo",
    "NotEqualTo",
    "CrossAbove",
    "CrossBelow",
    "+",
    "-",
  ].map((item) => ({
    label: item,
    value: item,
  }));

  const handleClose = () => setOpen(false);

  const handleAddCondition = () => {
    const newCondition = {};
    setConditions([...conditions, newCondition]);
   
  };
  const candleData = ["Close", "Open", "High", "Low", "Volume"].map((item) => ({
    label: item,
    value: item,
  }));

  const setFormValue = (name, index, e) => {
    setCurrentIndex(index);
  
    const updatedConditions = [...conditions];
    const currentCondition = updatedConditions[index] || {};
  
    if (
      e === "Open" ||
      e === "Close" ||
      e === "High" ||
      e === "Low" ||
      e === "Volume" ||
      e === "RSI" ||
      e ==="ATR" ||
      e==="TR" ||
      e==="SMA" ||
      e==="EMA" ||
      e==="RMA"
    ) {
      setOpen(true);
      setHeader(e);
      setFieldValue(name);
    }
  
    if (name === "operator") {
      setOpen(false);
    }
  
    // Clear values at the respective index if "first" or "second" field changes
    if (
      (name === "first" && currentCondition[name] !== e) ||
      (name === "second" && currentCondition[name] !== e)
    ) {
      currentCondition[`_${name}_period`] = undefined;
      currentCondition[`_${name}_offset`] = undefined;
      currentCondition[`_${name}_candle`] = undefined;
    }
  
    if (name === "airthmetic") {
      if (!currentCondition.indicators) {
        currentCondition.indicators = [];
      }
  
      currentCondition.indicators.push({});
      currentCondition[name] = e;
    } else {
      currentCondition[name] = e;
    }
  
    updatedConditions[index] = currentCondition;
    setConditions(updatedConditions);
    
  };
  

  const getSelectedValuesAsJSON = () => {
 
    const formattedConditions = conditions.map((condition, index) => {
      const indicators = [];
 
      if (condition.indicators && condition.indicators.length > 0) {
        condition.indicators.forEach((indicator, i) => {
          const typeKey = `indicators_${index}_${i}`;
          const periodKey = `_${typeKey}`;
         
  
          const newIndicator = {
            type: condition[typeKey],
            period: condition[periodKey],
          };
  
          indicators.push(newIndicator);
        });
      }
  
  const firstcond = condition.first;
  const secondcond = condition.second;
     const comparison = {
      type: "Comparator",
        value: condition.operator,
        lhs: {
          type: ["RSI", "SMA", "RMA", "EMA", "ATR", "TR"].includes(firstcond) ? "Indicator" : firstcond === "Number" ? "Number" : "Selector",
          ...(firstcond !== "RSI" && { offset: condition._first_offset }),
          ...(firstcond === "RSI" && { offset: condition._first_offset, args : {
            period: condition._first_period
          } }),
          ...(["SMA", "RMA", "EMA"].includes(firstcond) && { offset: condition._first_offset, args : {
            period: condition._first_period,
            candle: condition._first_candle
          } }),
        },
        
        rhs: {
          type: ["RSI", "SMA", "RMA", "EMA", "ATR", "TR"].includes(secondcond) ? "Indicator" : secondcond === "Number" ? "Number" : "Selector",
          ...(secondcond !== "RSI" && { offset: condition._second_offset }),
          ...(secondcond === "RSI" && {offset: condition._second_offset , "args": {
            "period": condition._second_period
          } }),
          ...(["SMA", "RMA", "EMA"].includes(secondcond) && { offset: condition._second_offset, args : {
            period: condition._second_period,
            candle: condition._second_candle
          } }),
        },
        
        combination:{
          "operator": condition.airthmetic,
          "indicators": indicators,
        }
      };


  
      return comparison;
    });
   
    return JSON.stringify(formattedConditions, null, 2);
  };
  

  const deleteCondition = (index) => {
    
    const updatedConditions = [...conditions];
    
    updatedConditions.splice(index, 1);
  
    
    setConditions(updatedConditions);
  };
  return (
    <div className="App">
     
      <div style={{display: showEntry ? 'block' : 'none'   }}>
      <div style={{margin: 20}}>
      <Toggle size="lg" checkedChildren="AND" unCheckedChildren="OR" disabled={conditions.length > 1 ? false : true}/>
  
      </div>
      <div>
       
        <ul style={{ listStyleType: "none" }}>
          {conditions.map((val, index) => (

<div className="comments-list" key={`val_${index}`}>
  <div className="comment-chain-container">
    <div className="comment-container">
      <div className="comment-icon"></div>
      <div className="comment">            
        <li key={index} className="groupBy flexDiv" >
              <div id={index} className="flexDiv">
                <>
      
                <Badge content={(val._first_period !== undefined ? val._first_period : '') + (val._first_offset !== undefined ? (val._first_period !== undefined ? ', ' : '') + val._first_offset : '') + (val._first_candle !== undefined ? (val._first_candle !== undefined ? ', ' : '') + val._first_candle : '')}>
     
                <SelectPicker
value={`${val.first}`}
defaultValue="Open"
  placeholder="+ Add"
  groupBy="role"
  data={data}
  name={`first`}
  style={{ width: 90, borderRadius: "0px" }}
  onChange={(e) => {
    setFormValue("first", index, e);
  }}
/>

                  </Badge>
                </>
                &nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;
                {val["first"] && (
                  <>
                  <Badge content={val.operator !==undefined ? val.operator : false} >
                    <SelectPicker
                      value={val.operator}
                      placeholder="+ Operator"
                      data={conditionalOperator}
                      style={{
                        width: "100%",
                        maxWidth: 200,
                        borderRadius: "0px",
                      }}
                      onChange={(e) => {
                        setFormValue("operator", index, e);
                      }}
                    /></Badge>
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    <Badge content={(val._second_period !== undefined ? val._second_period : '') + (val._second_offset !== undefined ? (val._second_period !== undefined ? ', ' : '') + val._second_offset : '') + (val._second_candle !== undefined ? (val._second_candle !== undefined ? ', ' : '') + val._second_candle : '')}>
                    <SelectPicker
                    value={val.second}
                      placeholder="+ Add"
                      groupBy="role"
                      data={data}
                      name={`second`}
                      style={{ width: 90, borderRadius: "0px" }}
                      onChange={(e) => {
                        setFormValue("second", index, e);
                      }}
                    /></Badge>
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    <Badge content={val.airthmetic !==undefined ? val.airthmetic : false} >
                    <SelectPicker

                      placeholder="+ Add"
                      data={arithmeticOperators}
                      name={`airthmetic`}
                      style={{ width: 90, borderRadius: "0px" }}
                      onChange={(e) => {
                        
                        setFormValue("airthmetic", index, e);
                      }}
                    />
                    </Badge>
                     
                 
                 {val?.indicators?.length>0 && <>
                  
                  {val.indicators.map((value, i)=>{
return <div key={"indiOT"+ index}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;

<Badge content={val[`_indicators_${index}_${i}`] !== undefined ? val[`_indicators_${index}_${i}`] : false} >
  <SelectPicker
  value={val[`indicators_${index}_${i}`]}
  
  placeholder="+ Add"
  data={data}
  groupBy="role"
  name={`indicators_${index}_${i}`}
  style={{ width: 90, borderRadius: "0px" }}
  onChange={(e) => {
    setFormValue(`indicators_${index}_${i}`, index, e);
  }}
/>
</Badge>
</div>
                   })}
                   </>}

                  </>
                )}
              </div>
              <div  className="divIcon" title="Delete Conditions" style={{position:"absoulte", cursor: "pointer"}}>
               
              
               <TrashIcon style={{fontSize:20}} onClick={()=>{
                deleteCondition(index);
              }}/>
 
 
              </div>
            </li></div>
            <div className="chain chain-bottom"></div>
    </div>
   
  
  </div>
</div>
          ))}
        </ul>
      </div>
     <div className="AdditionalButton">
     <Button
        onClick={() => {
          const jsonFormat = getSelectedValuesAsJSON();
          console.log(jsonFormat);
         
        }}
        appearance="link"
      >
        Get Selected Values as JSON
      </Button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <Button onClick={handleAddCondition} appearance="link">
        + Add Condition
      </Button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <Button
        onClick={() => {
          alert(currentIndex)
        }}
        appearance="link"
      >
        + Add Group
      </Button>
     </div>
     </div>

      <Modal open={open} onClose={handleClose} backdrop="static" keyboard={false} backdropClassName="modalBackdrop">
        <Modal.Header>
          <Modal.Title>{header}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
        {["RSI", "SMA", "RMA", "EMA", "ATR"].includes(header) && <> <b>Period:</b> <Input
          defaultValue={0}
            type="number"
            onChange={(e) => {
              setFormValue(`_${fieldValue}_period`, currentIndex, e);
            }}
          /><br /></>}
          
          <b>Offset:</b> <Input
          defaultValue={0}
            type="number"
            onChange={(e) => {
              setFormValue(`_${fieldValue}_offset`, currentIndex, e);
            }}
          />

{["SMA", "RMA", "EMA"].includes(header) && <> <br /><b>Candle:</b> 
<br />
<select style={{width: "100%"}} className="rs-input" onChange={(e) => {
              setFormValue(`_${fieldValue}_candle`, currentIndex, e.target.value);
            }}>
<option>Open</option>
<option>Close</option>
<option>High</option>
<option>Low</option>
<option>Volume</option>

</select>
<br /></>}      
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="primary">
            Done
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
     
      
    </div>
   
  );
}
