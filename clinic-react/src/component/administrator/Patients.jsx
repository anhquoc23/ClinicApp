import { useEffect, useState } from "react"
import { Alert, Button, Col, Form, Row } from "react-bootstrap"
import { authUser, endpoints } from "../../configs/Apis"
import { USER_ROLE } from "../../configs/Enum"
import Loading from "../../layout/Loading"

const Patient = () => {
    const [name, setName] = useState('')
    const [patients, setPatients] = useState(null)


    useEffect(() => {
        const process = async() => {
            let api = endpoints['user']['list-by-role'](USER_ROLE.PATIENT)
            if(name !== '')
            api += `?name=${name}`
            let res =await authUser().get(api)
            setPatients(res.data)
        }

        process()
    }, [name])

    if(patients === null) return <Loading />

    return (<>
        <Alert variant="info">Danh Sách Bệnh nhân</Alert>
        <Form>
        
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Col sm={1}></Col>
            <Form.Label column sm={2} onSubmit={evt => {evt.preventDefault()}}>
              Tên Bệnh nhân
            </Form.Label>
            <Col sm={2}>
              <Form.Control
                type="text"
                placeholder="nhập từ khoá..."
                name="name" onChange={evt => setName(evt.target.value)}
              />
            </Col>
            <Col sm={5}>
              
            </Col>
          </Form.Group>
        </Form>

        <table  className="table--user">
            <thead>
                <tr>
                    <th>Họ và tên</th>
                    <th>địa chỉ</th>
                    <th>Số điện thoại</th>
                    <th>email</th>
                </tr>
            </thead>
            <tbody>
                {
                    patients.map(p => {
                        return <tr>
                        <td>{p[2]}</td>
                        <td>{p[3]}</td>
                        <td>{p[5]}</td>
                        <td>{p[4]}</td>
                    </tr>
                    })
                }
            </tbody>
        </table>
        </>)
}

export default Patient