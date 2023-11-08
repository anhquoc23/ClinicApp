import { useEffect, useState } from "react";
import { authUser, contentType, endpoints } from "../../configs/Apis";
import { Alert, Button, Col, Form, Row, Table } from "react-bootstrap";
import Loading from "../../layout/Loading";

const Specialization = () => {
  const [specials, setSpecials] = useState(null);
  const [remove, isRemove] = useState(false);
  const [add, setAdd] = useState(false);
  const [name, setName] = useState("");

  const deleteItem = async (item) => {
    /* eslint-disable no-restricted-globals */
    if (confirm("Bạn có muốn xoá nó không?")) {
      try {
        let res = await authUser().delete(
          endpoints["specialization"]["delete"](item)
        );
        alert(res.data["message"]);
        isRemove(true);
      } catch (ex) {
        alert('Không thể xoá khoa này. Vui lòng chuyển hết những bác sỹ sang khoa khác rồi xoá sau.')
      }
    }
  };

  const addItem = async (evt) => {
    evt.preventDefault();
    try {
      if (name !== null && name != "") {
        let res = await authUser(contentType["json"]).post(
          endpoints["specialization"]["add"],
          {
            name: name,
          }
        );
        alert(res.data["message"]);
        setAdd(true);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  useEffect(() => {
    const process = async () => {
      try {
        let res = await authUser().get(endpoints["specialization"]["lists"]);
        setSpecials(res.data);
      } catch (ex) {
        console.log(ex);
      }
    };
    process();
    setAdd(false);
    isRemove(false);
  }, [remove, add]);

  if (specials === null) return <Loading />;

  return (
    <>
      <Alert variant="info">Quản lý khoa</Alert>
      <Form style={{ width: "80%", margin: "auto" }} onSubmit={addItem}>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            tên khoa
          </Form.Label>
          <Col sm="8">
            <Form.Control
              type="text"
              onChange={(evt) => setName(evt.target.value)}
            />
          </Col>
          <Col sm="2">
            <Button type="submit" variant="success">
              Thêm khoa
            </Button>
          </Col>
        </Form.Group>
      </Form>
      <Table
        responsive
        style={{ width: "80%", margin: "auto" }}
        className="text-center"
      >
        <thead>
          <tr>
            <th style={{ width: "3%" }}>#</th>
            <th style={{ width: "85%" }}>Tên Khoa</th>
            <th style={{ width: "12%" }}></th>
          </tr>
        </thead>
        <tbody>
          {specials.map((s) => {
            return (
              <tr>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    style={{ width: "100%" }}
                    onClick={() => deleteItem(s.id)}
                  >
                    Xoá
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default Specialization;
