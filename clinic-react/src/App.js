import logo from './logo.svg';
import './App.css';
import './static/css/table.css'
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Header from './layout/Header';
import Home from './component/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-calendar/dist/Calendar.css';
import Footer from './layout/Footer';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Login from './component/Login';
import { createContext, useReducer } from 'react';
import MyUserReducer from './reducers/MyUserReducer';
import cookie from 'react-cookies'
import InfoAcount from './component/InfoAccount';
import ChangePassword from './component/ChangePassword';
import Register from './component/patient/Register';
import Appointment from './component/patient/Appointment';
import ListAppointment from './component/patient/ListAppointment';
import Forbidden from './error-pages/Forbidden'
import { Redirect } from './configs/Permission';
import PermissionRoute from './route/PermissionRoute';
import Confirmed from './component/nurse/Confirmed';
import Today from './component/nurse/Today';
import Medical from './component/doctor/Medical';
import Prescription from './component/doctor/Presciption';
import History from './component/doctor/History';
import DetailMedical from './component/doctor/DetailMedical';
import Medicine from './component/administrator/Medicine';
import Categories from './component/administrator/Categories';
import UnitMedicine from './component/administrator/UnitMedicine';
import Doctors from './component/administrator/Doctors';
import Nurses from './component/administrator/Nurses';
import Specialization from './component/administrator/Specialization';
import Room from './component/administrator/Room';
import Schedule from './component/administrator/Schedule';
import ViewSchedule from './component/administrator/Calendar';
import Invoices from './component/nurse/Invoices';
import InvoiceDetail from './component/nurse/InvoiceDetail';
import { CategoryScale, Chart } from 'chart.js';
import Patient from './component/administrator/Patients';

export const MyUserContext = createContext()
Chart.register(CategoryScale)

function App() {
  const [currentUser, stateUser] = useReducer(MyUserReducer, cookie.load('user')|| null)

  return (
    <MyUserContext.Provider value={[currentUser, stateUser]}>
      <BrowserRouter>
      <Header />
      {/* <Container> */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/account-setting' element={<InfoAcount />} />
        <Route path='/account-setting/change-password' element={<ChangePassword />} />
        <Route path='/register' element={<Register />} />
        <Route path='/appointment' element={<PermissionRoute path='/appointment' component={<Appointment />} />} />
        <Route path='/list-appointment' element={<ListAppointment />} />
        <Route path='/nurse/confirmed' element={<PermissionRoute path='/nurse/confirmed' component={<Confirmed />} />} />
        <Route path='/nurse/present' element={<PermissionRoute path='/nurse/present' component={<Today />} />} />
        <Route path='/doctor/medical' element={<PermissionRoute path='/doctor/medical' component={<Medical />} />} />
        <Route path='/doctor/medical/prescription/:medicalId/:patientId' element={<PermissionRoute path='/doctor/medical/prescription/:medicalId/:patientId' component={<Prescription />} />} />
        <Route path='/doctor/medical/history' element={<PermissionRoute path='/doctor/medical/history' component={<History />} />} />
        <Route path='/doctor/medical/history/:medicalId' element={<PermissionRoute path='/doctor/medical/history/:medicalId' component={<DetailMedical />} />} />
        <Route path='/admin/medicine' element={<PermissionRoute path='/admin/medicine' component={<Medicine />} />} />
        <Route path='/admin/medicine/categories' element={<PermissionRoute path='/admin/medicine/categories' component={<Categories />} />} />
        <Route path='/admin/medicine/unit' element={<PermissionRoute path='/admin/medicine/unit' component={<UnitMedicine />} />} />
        <Route path='/forbidden' element={<Forbidden />} />
        <Route path='/admin/user/doctors' element={<PermissionRoute path='/admin/user/doctors' component={<Doctors />} />} />
        <Route path='/admin/user/nurses' element={<PermissionRoute path='/admin/user/nurses' component={<Nurses />} />} />
        <Route path='/admin/user/patients' element={<PermissionRoute path='/admin/user/patients' component={<Patient />} />} />
        <Route path='/admin/specializations' element={<PermissionRoute path='/admin/specializations' component={<Specialization />} />} />
        <Route path='/admin/room' element={<PermissionRoute path='/admin/room' component={<Room />} />} />
        <Route path='/admin/schedule/add' element={<PermissionRoute path='/admin/schedule/add' component={<Schedule />} />} />
        <Route path='/schedule/' element={<PermissionRoute path='/schedule' component={<ViewSchedule />} />} />
        <Route path='/nurse/invoices' element={<PermissionRoute path='/nurse/invoices' component={<Invoices />} />} />
        <Route path='/nurse/invoices/:invoiceId' element={<PermissionRoute path='/nurse/invoices/:invoiceId' component={<InvoiceDetail />} />} />
      </Routes>
      {/* </Container> */}
      <Footer />
    </BrowserRouter>
    </MyUserContext.Provider>
  );
}

export default App;
