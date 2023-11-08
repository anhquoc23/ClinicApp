import { Badge, ToggleButton } from "react-bootstrap";
// import "../../static/css/table.css";
import { useEffect, useState } from "react";
import { authUser, contentType, endpoints } from "../../configs/Apis";
import Loading from "../../layout/Loading";
import { APPOINTMENT_STATUS } from "../../configs/Enum";

const ListAppointment = () => {
  const [appointments, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  const cancleAppointment = async (a) => {
    try {
      setLoading(true);
      /* eslint-disable no-restricted-globals */
      if (confirm("Bạn có muốn huỷ lịch khám này không?")) {
        let res = await authUser().post(endpoints["appointment"]["cancle"], a);
        console.log(res.data["message"]);
        alert(res.data["message"]);
        setComplete(true);
      }
    } catch (ex) {
      console.log(ex);
      alert("Có lỗi xảy ra. Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const process = async () => {
      try {
        let res = await authUser().get(
          endpoints["appointment"]["list"]
        );
        setAppointment(res.data);
      } catch (ex) {
        console.log(ex);
      }
    };

    process();
    setComplete(false);
  }, [complete]);

  if (appointments === null) return <Loading />;
  return (
    <table className="table--user">
      <thead>
        <tr>
          <th style={{ width: "20%" }}>Ngày thực hiện</th>
          <th style={{ width: "20%" }}>Ngày khám Bệnh</th>
          <th style={{ width: "20%" }}>Trạng thái</th>
          <th style={{ width: "20%" }}>Y Tá xác nhận</th>
          <th style={{ width: "20%" }}></th>
        </tr>
      </thead>
      <tbody>
        {
          appointments.map(a => {
            return <tr>
              <td>{new Date(a.createdDate).toISOString().split("T")[0]}</td>
              <td>{new Date(a.appointmentDate).toISOString().split("T")[0]}</td>
              <td>
                 {a.appointmentStatus === APPOINTMENT_STATUS.WAITTING ? (
                  <Badge bg="warning">Đang chờ xác nhận</Badge>
                ) : a.appointmentStatus === APPOINTMENT_STATUS.CANCLED ? (
                  <Badge bg="danger">Đã huỷ</Badge>
                ) : (
                  <Badge bg="success">Xác Nhận thành công</Badge>
                )}
              </td>
              <td>
                 {a.nurseId === null ? (
                  <Badge bg="info">Chưa xác nhận</Badge>
                ) : a.nurseId.fullName}
               </td>
               <td>
                   {a.appointmentStatus === APPOINTMENT_STATUS.WAITTING &&
                   <div>
                   <ToggleButton
                    id="toggle-check"
                    type="button"
                    variant="outline-danger"
                    checked={false}
                    value="1"
                    onClick={() => cancleAppointment(a)}
                  >
                    Huỷ Lịch
                  </ToggleButton>
                </div>
                   }
                 </td>
            </tr>
          })
        }
      </tbody>
    </table>
    // <table className="table--user">
    //   <thead>
    //     <tr>
    //       <th style={{ width: 100 }}>Ngày Thực Hiện s</th>
    //       <th style={{ width: "20%" }}>Ngày Khám Bệnh</th>
    //       <th style={{ width: "20%" }}>Status</th>
    //       <th style={{ width: "20%" }}>Y Tá xác nhận</th>
    //       <th style={{ width: "20%" }}></th>
    //     </tr>
    //   </thead>
    //   <tbody>
    //     {appointments.map((a) => {
    //       return (
    //         <tr>
    //           <td>{new Date(a.createdDate).toISOString().split("T")[0]}</td>
    //           <td>{new Date(a.appointmentDate).toISOString().split("T")[0]}</td>
    //           <td>
    //             {a.appointmentStatus === APPOINTMENT_STATUS.WAITTING ? (
    //               <Badge bg="warning">Đang chờ xác nhận</Badge>
    //             ) : a.appointmentStatus === APPOINTMENT_STATUS.CANCLED ? (
    //               <Badge bg="danger">Đã huỷ</Badge>
    //             ) : (
    //               <Badge bg="success">Xác Nhận thành công</Badge>
    //             )}
    //           </td>
    //           <td>
    //             {a.nurseId === null ? (
    //               <Badge bg="info">Chưa xác nhận</Badge>
    //             ) : (
    //               <div className="d-flex align-items-center">
    //                 <div className="img-container">
    //                   <img src={a.nurseId.avatar} alt={a.nurseId.fullName} />
    //                 </div>
    //                 <div className="ps-3">
    //                   <div className="fw-600 pb-1">{a.nurseId.email}</div>
    //                   <p className="m-0 text-grey fs-09">
    //                     {a.nurseId.fullName}
    //                   </p>
    //                 </div>
    //               </div>
    //             )}
    //           </td>
    //           {a.appointmentStatus === APPOINTMENT_STATUS.WAITTING ? (
    //             <td>
    //               <div>
    //                 <ToggleButton
    //                   id="toggle-check"
    //                   type="button"
    //                   variant="outline-danger"
    //                   checked={false}
    //                   value="1"
    //                   onClick={() => cancleAppointment(a)}
    //                 >
    //                   Huỷ Lịch
    //                 </ToggleButton>
    //               </div>
    //             </td>
    //           ) : (
    //             <td></td>
    //           )}
    //         </tr>
    //       );
    //     })}
    //   </tbody>
    // </table>
  );
};

export default ListAppointment;
