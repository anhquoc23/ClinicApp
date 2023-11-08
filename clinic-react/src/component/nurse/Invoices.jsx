import { Alert } from "react-bootstrap"
import '../../static/css/invoice.css'
import { useEffect, useState } from "react"
import { authUser, endpoints } from "../../configs/Apis"
import Loading from "../../layout/Loading"
import { INVOICE_STATUS } from "../../configs/Enum"
import { Link } from "react-router-dom"

const Invoices = () => {
    const [invoices, setInvoices] = useState(null)



    useEffect(() => {
        const loadInvoice = async () => {
            let res = await authUser().get(endpoints['invoice']['list'])
            setInvoices(res.data)
        }

        loadInvoice()
    }, [])

    if(invoices === null) return <Loading />

    return(<>
        <Alert variant="info">Danh sách hoá đơn</Alert>
        <div className="table--invoice">
            <div className="cell-head">
                <span className="cell">Mã Hoá Đơn</span>
                <span className="cell">Tên bệnh nhân</span>
                <span className="cell">Ngày tạo</span>
                <span className="cell">Trạng thái thanh toán</span>
                <span className="cell">Actions</span>
            </div>
            {
                invoices.map(i => {
                    return <div className="cell-body">
                    <span className="cell">{i[0]}</span>
                    <span className="cell">{i[1]}</span>
                    <span className="cell">{new Date(i[2]).toISOString().split('T')[0]}</span>
                    {i[3] === INVOICE_STATUS.ACCEPTED?<span className="cell text-success">Đã thanh toán</span>:<span className="cell text-danger">Đang chờ thanh toán</span>}
                    <span className="cell"><Link to={`/nurse/invoices/${i[0]}`} className="text-danger" style={{textDecoration: 'none'}}>Xem chi tiết</Link></span>
                </div>
                })
            }
        </div>
    </>)
}

export default Invoices