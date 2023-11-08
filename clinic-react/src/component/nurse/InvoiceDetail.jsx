import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { authUser, endpoints } from "../../configs/Apis";
import { useParams } from "react-router-dom";
import Loading from "../../layout/Loading";
import { INVOICE_STATUS } from "../../configs/Enum";
import { formatCurrency } from "../../utils/utils";

const InvoiceDetail = () => {
  const [invoice, setInvoice] = useState(null);
  const [prescriptions, setPrescriptions] = useState(null);
  const { invoiceId } = useParams();
  const [fees, setFees] = useState(null)
  const [payment, setPayment] = useState(false)

  const pay = async() => {
    try {
        let res = await authUser().post(endpoints['invoice']['payment-direct'](invoiceId))
        alert(res.data['message'])
    } catch(ex) {alert('có lỗi xảy ra'); console.log(ex)} finally {setPayment(true)}
  }

  useEffect(() => {
    const loadInvoice = async () => {
      let res = await authUser().get(endpoints["invoice"]["detail"](invoiceId));
      setInvoice(res.data);
    };

    const loadPrescitions = async () => {
      let res = await authUser().get(endpoints['invoice']['prescription'](invoiceId));
      setPrescriptions(res.data);
    };

    const loadFees = async() => {
        let res = await authUser().get(endpoints['invoice']['fee'](invoiceId))
        setFees(res.data)
    }

    loadInvoice();
    loadPrescitions();
    loadFees()
    setPayment(false)
  }, [payment]);

  if (invoice === null || prescriptions === null || fees === null) return <Loading />;
  return (
    <>
      <section className="invoice-detail">
        <h1 className="invoice-details--title">INVOICES</h1>
        <div className="invoice-details--info-patient">
          <h5>{invoice.medicalRecordId.patientId.fullName}</h5>
          <h5>{invoice.medicalRecordId.patientId.phone}</h5>
          <h5>{invoice.medicalRecordId.patientId.email}</h5>
        </div>
        <div className="invoice-details--info-invoice">
          <div className="invoice-details--info-invoice--thead">
            <span>Mã Hoá Đơn</span>
            <span>
              #INV-{new Date(invoice.createDate).getDate()}
              {new Date(invoice.createDate).getMonth()}
              {new Date(invoice.createDate).getFullYear()}-{invoice.id}
            </span>
          </div>
          <div className="invoice-details--info-invoice--thead">
            <span>Ngày tạo</span>
            <span>
              {new Date(invoice.createDate).toISOString().split("T")[0]}
            </span>
          </div>
          <div className="invoice-details--info-invoice--thead">
            <span>Y tá xác nhận</span>
            {invoice.paymentStatus === INVOICE_STATUS.PENDING ? (
              <span className="text-danger">Chưa thanh toán</span>
            ) : (
              <span>{invoice.nurseId.fullName}</span>
            )}
          </div>
        </div>
        <div className="invoice--table">
          <Table responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Tên thuốc</th>
                <th>Liều lượng</th>
                <th>Tần suất</th>
                <th>Thời gian sử dụng</th>
                <th>Số lượng dùng</th>
                <th>tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {
                prescriptions.map((p, i) => {
                  return (
                    <tr>
                      <td>{i + 1}</td>
                      <td>{p[0]}</td>
                      <td>{p[1]}</td>
                      <td>{p[2]}</td>
                      <td>{p[3]}</td>
                      <td>{p[4]}</td>
                      <td>{formatCurrency(p[5])} VNĐ</td>
                    </tr>
                  );
                })}
              <tr style={{height: 40}}>
                <td colSpan="7"></td>
              </tr>
              <tr>
                <td colSpan="5" style={{border: 'none'}}></td>
                <td style={{ fontWeight: "bold", color: "red"}}>
                  Tổng tiền thuốc
                </td>
                <td>{formatCurrency(fees[1])} VNĐ</td>
              </tr>
              <tr>
                <td colSpan="5" style={{border: 'none'}}></td>
                <td style={{ fontWeight: "bold", color: "red" }}>Tiền khám</td>
                <td>{formatCurrency(fees[0])} VNĐ</td>
              </tr>
              <tr>
                <td colSpan="5" style={{border: 'none'}}></td>
                <td style={{ fontWeight: "bold", color: "red" }}>Tổng tiền</td>
                <td>{formatCurrency(fees[0] + fees[1])} VNĐ</td>
              </tr>
            </tbody>
          </Table>
        </div>
        {invoice.paymentStatus === INVOICE_STATUS.PENDING && <Form.Group as={Row}>
            <Col sm="10"></Col>
            <Col sm="2"><Button variant='success' onClick={() => pay()}>Thanh toán</Button></Col>
            </Form.Group>}
      </section>
    </>
  );
};

export default InvoiceDetail;
