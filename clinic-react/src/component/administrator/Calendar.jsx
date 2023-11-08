import { useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row, Table } from "react-bootstrap"
import { authUser, endpoints } from "../../configs/Apis";
import Loading from "../../layout/Loading";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MyUserContext } from "../../App";
import { USER_ROLE } from "../../configs/Enum";

const ViewSchedule = () => {
    const [schedules, setSchedules] = useState(null)
    const [q] = useSearchParams()
    const [date, setDate] = useState(null)
    const nav = useNavigate()
    const [currentUser, state] = useContext(MyUserContext)

    const search = async(evt) => {
        evt.preventDefault()
        
        nav(`?date=${date}`)
    }

    useEffect(() => {
        const loadSchedules = async() =>{
            let url = endpoints['schedule']['list']
            if(q.get('date') != null)
                url += `?date=${q.get('date')}`
            console.log(url)
            let res = await authUser().get(url)
            setSchedules(res.data)
        }

        loadSchedules()
    }, [q.get('date')])

    if(schedules === null) return <Loading />

    return(<>
        <Alert variant="info">Lịch làm việc</Alert>
        <Form style={{margin: 50}} onSubmit={search}>
            <Form.Group as={Row}>
                <Col sm="1"></Col>
                <Col sm="3"><Form.Control type="date" name="date" onChange={evt => setDate(evt.target.value)} /></Col>
                <Col sm="3"><Button variant="primary" type="submit">Xem lịch</Button></Col>
                {currentUser !== null && (currentUser.userRole === USER_ROLE.ADMIN || currentUser.userRole === USER_ROLE.OWNER)
                ?<>
                    <Col sm="2"></Col>
                    <Col sm="3"><Link to='/admin/schedule/add' className="btn btn-outline-success">Tạo lịch</Link></Col>
                </>:<span></span>}
            </Form.Group>
        </Form>
        {schedules.length === 0 ? <Alert variant="success">Không có lịch trực</Alert>:
        <Table responsive style={{width: '80%', margin: 'auto', marginBottom: 50}} className="text-center table--user">
        <thead>
          <tr>
            <th>Họ và tên</th>
            <th>giờ bắt đầu</th>
            <th>giờ kết thúc</th>
            <th>Phòng làm việc</th>
            <th>Chức vụ</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => {
            return (
              <tr>
                <td>{s[0]}</td>
                <td>{s[1]}</td>
                <td>{s[2]}</td>
                <td>{s[3]}</td>
                <td>{s[4]}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>}
    </>)
}

export default ViewSchedule