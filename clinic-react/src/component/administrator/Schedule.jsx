import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import "../../static/css/schedule.css";
import { useEffect, useState } from "react";
import { authUser, contentType, endpoints } from "../../configs/Apis";
import { USER_ROLE } from "../../configs/Enum"
import Loading from "../../layout/Loading";
import Shift, { getShiftById } from "../../configs/Shift";
import { Link } from "react-router-dom";

const Schedule = () => {
    const [doctors, setDoctors] = useState(null)
    const [nurses, setNurses] = useState(null)
    const [rooms, setRooms] = useState(null)
    const [shifts, setShifts] = useState(null)
    const [toggle, setToggle] = useState(true)
    const [schedule, setSchedule] = useState({
        'scheduleDate': null,
        'shiftStart': null,
        'shiftEnd': null,
        'userId': null,
        'roomId': null
    })
    const [shift, setShift] = useState(null)
    const [loading, setLoading] = useState(false)

    // Function

    const changeValue = (field, value) => {
        setSchedule(current => {
            return {...current, [field]: value}
        })
    }

    const addSchedule = async(evt) => {
        evt.preventDefault()
        if(shift === null) {
            alert('Chọn ca trực')
            return
        }

        if(schedule['userId'] === null) {
            alert('Chọn nhân viên')
            return
        }

        if(schedule['roomId'] === null) {
            alert('Chọn phòng trực')
            return
        }

        try {
            setLoading(true)
            schedule['shiftStart'] = Shift[shift]['shiftStart']
            schedule['shiftEnd'] = Shift[shift]['shiftEnd']
            let form = new FormData()
            for(let field in schedule) form.append(field, schedule[field])
            let res = await authUser(contentType['form']).post(endpoints['schedule']['add'], form)
            alert(res.data['message'])
        } catch(ex) {alert('Có lỗi xảy ra'); console.log(ex)} finally{setLoading(false)}

        console.log(schedule)
    }


    // useEffect
    useEffect(() => {
        const loadDoctors = async() => {
            let res = await authUser().get(endpoints['user']['list-by-role'](USER_ROLE.DOCTOR))
            setDoctors(res.data)
        }
        const loadNurses = async() => {
            let res = await authUser().get(endpoints['user']['list-by-role'](USER_ROLE.NURSE))
            setNurses(res.data)
        }
        const loadRooms = async() => {
            let res = await authUser().get(endpoints['room']['list'])
            setRooms(res.data)
        }
        const loadShifts = async() => {await setShifts(Shift)}

        loadDoctors()
        loadNurses()
        loadShifts()
        loadRooms()
    }, [toggle, loading])

    if(doctors === null || nurses === null || rooms === null || shifts === null) return <Loading />

  return (
    <>
      <Alert variant="info">Lịch trực nhân viên</Alert>
      <div className="form--schedule-box">
        <div className="form-schedule-header">
          <h3>Tạo lịch</h3>
        </div>
        <div className="form-schedule-content">
          <Form onSubmit={addSchedule}>
            <Form.Group as={Row} className="mb-3"controlId="formPlaintextEmail">
              <Form.Label column sm="2">Ngày trực</Form.Label>
              <Col sm="6">
                <Form.Control type="date" min={new Date().toISOString().split('T')[0]} required onChange={evt => changeValue('scheduleDate', evt.target.value)} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3"controlId="formPlaintextEmail">
              <Form.Label column sm="2">Ca trực</Form.Label>
              <Col sm="6">
                <Form.Select onChange={evt => setShift(evt.target.value)}>
                {shifts.map(s => {return <option value={s.id - 1}>{s.name} thời gian làm việc từ {s.shiftStart} - {s.shiftEnd}</option>})}
                </Form.Select>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3"controlId="formPlaintextEmail">
              <Form.Label column sm="2">Nhân viên</Form.Label>
              <Col sm="6">
                <Form.Select onChange={evt => changeValue('userId', evt.target.value)}>
                {toggle && doctors.map(d => {return <option value={d[0]}>{d[2]}</option>})}
                    {!toggle && nurses.map(n => {return <option value={n[0]}>{n[2]}</option>})}
                </Form.Select>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3"controlId="formPlaintextEmail">
              <Form.Label column sm="2"></Form.Label>
              <Col sm="6">
                <Form.Check inline label="Bác sỹ" defaultChecked name="typeUser" type='radio' onClick={() => setToggle(true)} />
                <Form.Check inline label="Y tá" name="typeUser" type='radio' onClick={() => setToggle(false)} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3"controlId="formPlaintextEmail" onChange={evt => changeValue('roomId', evt.target.value)}>
              <Form.Label column sm="2">Phòng trực</Form.Label>
              <Col sm="6">
                <Form.Select>
                    {rooms.map(r => {return <option value={r.id}>{r.name}</option>})}
                </Form.Select>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>{loading && <Loading />}</Form.Label>
                <Col sm="4"><Link to='/schedule' className="btn btn-outline-primary">Xem lịch trực</Link></Col>
                <Col sm="4"><Button variant="outline-success" type="submit">Tạo lịch</Button></Col>
            </Form.Group>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Schedule;
