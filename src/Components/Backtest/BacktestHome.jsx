import { useState } from "react";
import TrashIcon from "@rsuite/icons/Trash";
import {
  FaAngleDown,
  FaAngleUp,
  FaDownload,
  FaSave,
  FaPlay,
  FaInfoCircle,
} from "react-icons/fa";
import {
  SelectPicker,
  Row,
  Col,
  Button,
  Input,
  Panel,
  Affix,
  ButtonToolbar,
  ButtonGroup,
  Toggle,
  Tooltip,
  Whisper,
  InputGroup,
} from "rsuite";
import LogicBuilder from "../Logic/LogicBuilder";
import { useDispatch } from "react-redux";
import { formValue } from "../../features/Backtest/BackTestSlice";

const instrumentList = [
  "ADANIENT",
  "ADANIPORTS",
  "APOLLOHOSP",
  "ASIANPAINT",
  "AXISBANK",
  "BAJAJ-AUTO",
  "BAJAJFINSV",
  "BAJFINANCE",
  "BHARTIARTL",
  "BPCL",
].map((item) => ({ label: item, value: item }));

export default function BacktestHome() {
  const dispatch = useDispatch();
  const [showEntry, setShowEntry] = useState(true);
  const [showExit, setShowExit] = useState(true);
  const [logicValue, setLogicValue] = useState({
    EntryIndicators: "",
    ExitIndicators: "",
  });

  const currentDate = getFormattedDate(); // Current date
  const yesterdayDate = getFormattedDate(-1); // Yesterday's date
  function getFormattedDate(offset = 0) {
    const today = new Date();
    today.setDate(today.getDate() + offset);

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
  const setFormValueFinal = async (type, data) => {
    setLogicValue((prevLogicValue) => ({
      ...prevLogicValue,
      [type === "Entry" ? "EntryIndicators" : "ExitIndicators"]: data,
    }));

    const dispatchedData = await dispatch(formValue(logicValue));

    console.log(logicValue); // This will log the previous state, not the updated state
  };

  return (
    <>
      <Affix top={60}>
        <Row style={{ marginBottom: 40, background: "#e7e7e7" }}>
          <Panel
            shaded
            style={{ paddingBottom: "20px", background: "#10122b" }}>
            <Col md={12}></Col>
            <Col md={4} sm={24}>
              <Button>
                <FaDownload /> &nbsp;Download PDF
              </Button>
            </Col>
            <Col md={4} sm={24}>
              <Button appearance="primary">
                <FaSave /> &nbsp;Save Strategy
              </Button>
            </Col>
            <Col md={4} sm={24}>
              <Button appearance="primary" color="green">
                <FaPlay /> &nbsp;Start Backtest
              </Button>
            </Col>
          </Panel>
        </Row>
      </Affix>
      <Row>
        <Col md={4}>
          <h4>Backtest</h4>
        </Col>
        <Col md={10}></Col>
        <Col md={5}>
          <h6>Credits: 0</h6>
        </Col>
        <Col md={5}>
          <h6>Add Credits +</h6>
        </Col>
      </Row>
      <hr />
      <Row
        style={{
          marginTop: 30,
          marginBottom: 30,
          padding: "3%",
          background: "#e7e7e7",
        }}>
        <Col md={6}>
          <p>Search Instrument</p>
          <SelectPicker data={instrumentList} style={{ width: 300 }} />
        </Col>
        <Col md={1}></Col>
        <Col md={3}>
          <p>Position</p>
          <Button appearance="ghost">Buy</Button>
          <Button appearance="ghost">Sell</Button>
        </Col>
        <Col md={1}></Col>
        <Col md={2}>
          <p>Quantity</p>
          <Input type="number" min="1" />
        </Col>
        <Col md={1}></Col>
        <Col md={8}>
          <p>Candle Intervals</p>
          <ButtonToolbar>
            <ButtonGroup>
              <Button appearance="ghost">1min</Button>
              <Button appearance="ghost">3min</Button>
              <Button appearance="ghost">5min</Button>
              <Button appearance="ghost">15min</Button>
              <Button appearance="ghost">1hr</Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
      </Row>
      <div>
        <h6
          onClick={() => {
            setShowEntry(!showEntry);
          }}
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
          Entry When &nbsp; {showEntry ? <FaAngleDown /> : <FaAngleUp />}
        </h6>
      </div>
      <LogicBuilder
        display={showEntry}
        type="Entry"
        setFormValueFinal={setFormValueFinal}
      />

      <div style={{ marginTop: "5%" }}>
        <h6
          onClick={() => {
            setShowExit(!showExit);
          }}
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
          Exit When &nbsp; {showExit ? <FaAngleDown /> : <FaAngleUp />}
        </h6>
      </div>
      <LogicBuilder
        display={showExit}
        type="Exit"
        setFormValueFinal={setFormValueFinal}
      />

      <Row style={{ marginTop: 50 }}>
        <Col md={24}>
          <h5>Trading Conditions</h5>
          <Row style={{ padding: 30, background: "#e7e7e7" }}>
            <Col md={8}>
              Target Profit &nbsp;
              <Toggle size="md" />
              <br />
              <br />
              <Row>
                <Col md={9}>
                  {" "}
                  <select
                    className="rs-input"
                    style={{ background: "#10122b", color: "#ffffff" }}>
                    <option value="%">Percent(%)</option>
                    <option value="pts">Points(Pts)</option>
                  </select>
                </Col>
                <Col md={12}>
                  <input
                    className="rs-input"
                    style={{ width: 100 }}
                    type="number"
                    min="0"
                  />
                </Col>
              </Row>
            </Col>
            <Col md={8}>
              Stop Loss &nbsp;
              <Toggle size="md" /> <br />
              <br />
              <Row>
                <Col md={9}>
                  {" "}
                  <select
                    className="rs-input"
                    style={{ background: "#10122b", color: "#ffffff" }}>
                    <option value="%">Percent(%)</option>
                    <option value="pts">Points(Pts)</option>
                  </select>
                </Col>
                <Col md={12}>
                  <input
                    className="rs-input"
                    style={{ width: 100 }}
                    type="number"
                    min="0"
                  />
                </Col>
              </Row>
            </Col>
            <Col md={8}>
              Trail SL{" "}
              <Whisper
                followCursor
                speaker={
                  <Tooltip>
                    With trailing SL, you can move your actual stop loss,
                    whenever the price moves in your favor. So every time the
                    instrument moves in your favor by X amount, we will move the
                    stop loss Y amount in the same direction. Amount can be in
                    terms of points or percentage.
                  </Tooltip>
                }>
                <span style={{ cursor: "pointer", verticalAlign: "-2px" }}>
                  <FaInfoCircle />
                </span>
              </Whisper>
              &nbsp;&nbsp;
              <Toggle size="md" /> <br />
              <br />
              <Row>
                <Col md={9}>
                  {" "}
                  <select
                    className="rs-input"
                    style={{ background: "#10122b", color: "#ffffff" }}>
                    <option value="%">Percent(%)</option>
                    <option value="pts">Points(Pts)</option>
                  </select>
                </Col>
                <Col md={6}>
                  <input
                    className="rs-input"
                    style={{ width: 80 }}
                    type="number"
                    min="1"
                  />
                </Col>{" "}
                <Col md={6}>
                  <input
                    className="rs-input"
                    style={{ width: 80 }}
                    type="number"
                    min="1"
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row style={{ padding: 30, background: "#e7e7e7" }}>
            <Col md={8}>
              Re-entry on Tgt &nbsp;
              <Toggle size="md" />
              <br />
              <br />
              <Row>
                <Col md={9}>
                  {" "}
                  <select
                    className="rs-input"
                    style={{ background: "#10122b", color: "#ffffff" }}>
                    <option value="ReentryType.Immediate" class="w-max">
                      RE ASAP
                    </option>
                    <option value="ReentryType.ImmediateReverse" class="w-max">
                      RE ASAP ↩
                    </option>
                    <option value="ReentryType.LikeOriginal" class="w-max">
                      RE MOMENTUM
                    </option>
                    <option
                      value="ReentryType.LikeOriginalReverse"
                      class="w-max">
                      RE MOMENTUM ↩
                    </option>
                    <option value="ReentryType.AtCost" class="w-max">
                      RE COST
                    </option>
                    <option value="ReentryType.AtCostReverse" class="w-max">
                      RE COST ↩
                    </option>
                  </select>
                </Col>
                <Col md={12}>
                  <input
                    className="rs-input"
                    style={{ width: 100 }}
                    type="number"
                    min="1"
                  />
                </Col>
              </Row>
            </Col>
            <Col md={8}>
              Re-entry on SL{" "}
              <Whisper
                followCursor
                speaker={
                  <Tooltip>
                    With trailing SL, you can move your actual stop loss,
                    whenever the price moves in your favor. So every time the
                    instrument moves in your favor by X amount, we will move the
                    stop loss Y amount in the same direction. Amount can be in
                    terms of points or percentage.
                  </Tooltip>
                }>
                <span style={{ cursor: "pointer", verticalAlign: "-2px" }}>
                  <FaInfoCircle />
                </span>
              </Whisper>
              &nbsp;&nbsp;
              <Toggle size="md" />
              <br />
              <br />
              <Row>
                <Col md={9}>
                  {" "}
                  <select
                    className="rs-input"
                    style={{ background: "#10122b", color: "#ffffff" }}>
                    <option value="ReentryType.Immediate" class="w-max">
                      RE ASAP
                    </option>
                    <option value="ReentryType.ImmediateReverse" class="w-max">
                      RE ASAP ↩
                    </option>
                    <option value="ReentryType.LikeOriginal" class="w-max">
                      RE MOMENTUM
                    </option>
                    <option
                      value="ReentryType.LikeOriginalReverse"
                      class="w-max">
                      RE MOMENTUM ↩
                    </option>
                    <option value="ReentryType.AtCost" class="w-max">
                      RE COST
                    </option>
                    <option value="ReentryType.AtCostReverse" class="w-max">
                      RE COST ↩
                    </option>
                  </select>
                </Col>
                <Col md={12}>
                  <input
                    className="rs-input"
                    style={{ width: 100 }}
                    type="number"
                    min="1"
                  />
                </Col>
              </Row>
            </Col>
            <Col md={8}>
              Simple Momentum{" "}
              <Whisper
                followCursor
                speaker={
                  <Tooltip>
                    With trailing SL, you can move your actual stop loss,
                    whenever the price moves in your favor. So every time the
                    instrument moves in your favor by X amount, we will move the
                    stop loss Y amount in the same direction. Amount can be in
                    terms of points or percentage.
                  </Tooltip>
                }>
                <span style={{ cursor: "pointer", verticalAlign: "-2px" }}>
                  <FaInfoCircle />
                </span>
              </Whisper>
              &nbsp;&nbsp;
              <Toggle size="md" />
              <br />
              <br />
              <Row>
                <Col md={9}>
                  {" "}
                  <select
                    className="rs-input"
                    style={{ background: "#10122b", color: "#ffffff" }}>
                    <option value="MomentumType.PointsUp" class="w-max">
                      Points (Pts) ↑
                    </option>
                    <option value="MomentumType.PointsDown" class="w-max">
                      Points (Pts) ↓
                    </option>
                    <option value="MomentumType.PercentageUp" class="w-max">
                      Percent (%) ↑
                    </option>
                    <option value="MomentumType.PercentageDown" class="w-max">
                      Percent (%) ↓
                    </option>
                  </select>
                </Col>
                <Col md={12}>
                  <input
                    className="rs-input"
                    style={{ width: 100 }}
                    type="number"
                    min="0"
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row style={{ marginTop: 50 }}>
        <Col md={24}>
          <h5>Date</h5>
          <Row style={{ padding: 30, background: "#e7e7e7" }}>
            <Col md={12} sm={24}>
              Enter the duration of your backtest
            </Col>
            <Col md={6} sm={24}>
              Start Date: <input type="date" value={currentDate} />
            </Col>
            <Col md={6} sm={24}>
              End Date: <input type="date" value={yesterdayDate} />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
