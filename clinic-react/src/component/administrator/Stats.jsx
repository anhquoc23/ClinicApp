import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import "../../static/css/stats.css";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import { ArcElement, BarElement, Chart, LinearScale } from "chart.js";
import { useEffect, useState } from "react";
import { authUser, endpoints } from "../../configs/Apis";
import {
  formatCurrency,
  getDateByStr,
  getQuarter,
  randomColor,
} from "../../utils/utils";
import Loading from "../../layout/Loading";
import { useNavigate, useSearchParams } from "react-router-dom";

const Stats = () => {
  Chart.register(LinearScale);
  Chart.register(BarElement);
  Chart.register(ArcElement);
  // Chart.register()

  const [amountPatient, setAmount] = useState(0);
  const [countMedical, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [top5Medicine, setTop5] = useState(null);
  const [bottom5Medicine, setBottom] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [type, setType] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [statRevenue, setStatRevenue] = useState(null);
  const [statPatient, setPatient] = useState(null);
  const [lableStat, setLable] = useState("");
  const nav = useNavigate();
  const [q] = useSearchParams();

  const filterStat = (evt) => {
    evt.preventDefault();

    nav(`?date=${date}&&type=${type}`);
    setToggle(!toggle);
  };

  const lable = (month, quarter, year, type) => {
    if(type === undefined)
      type = q.get('type')
    let t = parseInt(type);
    switch (t) {
      case 0:
        setLable(`Quý ${quarter} năm ${year}`);
        break;
      case 2:
        setLable(`Các Tháng của năm ${year}`);
        break;
      default:
        setLable(`năm ${year}`);
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      let res = await authUser().get(endpoints["stats"]["count-patient"]);
      setAmount(res.data);

      res = await authUser().get(endpoints["stats"]["count-medical"]);
      setCount(res.data);

      res = await authUser().get(endpoints["stats"]["total-revenue"]);
      setTotal(res.data);
    };

    const loadMedicineStat = async () => {
      let res = await authUser().get(endpoints["stats"]["stat-medicine"](0));
      setTop5(res.data);

      res = await authUser().get(endpoints["stats"]["stat-medicine"](1));
      setBottom(res.data);
    };

    const loadStatFilter = async () => {
      console.log(
        `${endpoints["stats"]["stat-revenue"]}?date=${date}&typeStat=${type}`
      );
      let res = await authUser().get(
        `${endpoints["stats"]["stat-revenue"]}?date=${date}&typeStat=${type}`
      );
      setStatRevenue(res.data);

      res = await authUser().get(
        `${endpoints["stats"]["stat-patient"]}?date=${date}&typeStat=${type}`
      );
      setPatient(res.data);
      console.log(type)
      let dateLable = getDateByStr(date)
      lable(
        dateLable.getMonth() + 1,
        getQuarter(dateLable.getMonth() + 1),
        dateLable.getFullYear(),
        type
      );
    };

    loadStats();
    loadMedicineStat();
    loadStatFilter();
    lable();
  }, [toggle]);

  if (
    top5Medicine === null ||
    bottom5Medicine === null ||
    statRevenue === null ||
    statPatient === null
  ) {
    return <Loading />;
  }

  return (
    <>
      <Alert variant="info">Thống kê - báo cáo</Alert>
      <div className="box--stats">
        <div className="box--stat-number">
          <div className="box--stat-number--title">Số bệnh nhân</div>
          <div className="box--stat-number--value">{amountPatient}</div>
        </div>
        <div className="box--stat-number">
          <div className="box--stat-number--title">Tổng doanh thu</div>
          <div className="box--stat-number--value">
            {formatCurrency(total)} VNĐ
          </div>
        </div>
        <div className="box--stat-number">
          <div className="box--stat-number--title">Số lần khám bệnh</div>
          <div className="box--stat-number--value">{countMedical}</div>
        </div>
      </div>
      <div className="chart">
        <div id="revenue">
          <Form className="filter--stats" onSubmit={filterStat}>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Thời gian
              </Form.Label>
              <Col sm="2">
                <Form.Control
                  type="date"
                  required
                  value={date}
                  onChange={(evt) => setDate(evt.target.value)}
                />
              </Col>
              <Col sm="2">
                <Form.Select onChange={(evt) => setType(evt.target.value)}>
                  {[0, 1, 2].map((i) => {
                    return (
                      <option value={i}>
                        {i === 0
                          ? "Theo quý"
                          : i === 2
                          ? "Theo Tháng"
                          : "Theo năm"}
                      </option>
                    );
                  })}
                </Form.Select>
              </Col>
              <Col sm="3">
                <Button
                  type="submit"
                  style={{ width: "50%" }}
                  variant="primary"
                >
                  Lọc
                </Button>
              </Col>
            </Form.Group>
          </Form>
          <div className="mt-5"></div>
          <Alert variant="primary">
            Biểu đồ thống kê doanh thu {lableStat}
          </Alert>
          <Bar
            data={{
              labels: statRevenue.map((r) => {
                return r[1];
              }),
              datasets: [
                {
                  label: "Thống kê doanh thu",
                  backgroundColor: randomColor(statRevenue.length),
                  data: statRevenue.map((r) => {
                    return r[0];
                  }),
                },
              ],
            }}
            options={{
              legend: { display: false },
              title: {
                display: true,
                text: "Biểu đồ thống kê doanh thu",
              },
            }}
          />
          <div className="mt-5"></div>
          <Alert variant="primary">
            Biểu đồ thống kê lượng bệnh nhân tới khám {lableStat}
          </Alert>
          <Bar
            style={{ width: "70%" }}
            data={{
              labels: statPatient.map((p) => {
                return p[1];
              }),
              datasets: [
                {
                  label: "Thống kê doanh thu",
                  backgroundColor: randomColor(statPatient.length),
                  data: statPatient.map((p) => {
                    return p[0];
                  }),
                },
              ],
            }}
            options={{
              legend: { display: true },
              title: {
                display: true,

                text: "Biểu đồ thống kê lượng bệnh nhân tới khám",
              },
            }}
          />
        </div>
        <div id="cirle-medicine">
          <Alert variant="primary">
            Biểu đồ Thống kê số lượng thuốc dùng ít nhất
          </Alert>
          <Bar
            data={{
              labels: bottom5Medicine.map((m) => {
                return m[0];
              }),
              datasets: [
                {
                  label: "Thống kê số lượng thuốc dùng nhiều nhất",
                  backgroundColor: randomColor(5),
                  data: bottom5Medicine.map((m) => {
                    return m[1];
                  }),
                },
              ],
            }}
            options={{
              legend: { display: false },
              title: {
                display: true,
                text: "Biểu đồ Thống kê số lượng thuốc dùng nhiều nhất",
              },
            }}
          />
          <div className="mt-5"></div>
          <Alert variant="primary">
            Biểu đồ Thống kê số lượng thuốc dùng nhiều nhất
          </Alert>
          <Bar
            data={{
              labels: top5Medicine.map((m) => {
                return m[0];
              }),
              datasets: [
                {
                  label: "Thống kê số lượng thuốc dùng ít nhất",
                  backgroundColor: randomColor(5),
                  data: top5Medicine.map((m) => {
                    return m[1];
                  }),
                },
              ],
            }}
            options={{
              legend: { display: false },
              title: {
                display: true,
                text: "Biểu đồ Thống kê số lượng thuốc dùng ít nhất",
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Stats;
