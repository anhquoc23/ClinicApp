/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.anhquoc0304.restapis;

import com.anhquoc0304.dto.Message;
import com.anhquoc0304.pojo.Invoice;
import com.anhquoc0304.pojo.User;
import com.anhquoc0304.service.InvoiceService;
import com.anhquoc0304.service.MedicalRecordService;
import com.anhquoc0304.service.PrescriptionService;
import com.anhquoc0304.service.UserService;
import java.security.Principal;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Admin
 */
@RestController
@CrossOrigin
public class ApiInvoicesController {
    @Autowired
    private InvoiceService invoiceService;
    @Autowired
    private PrescriptionService prescriptionSv;
    @Autowired
    private MedicalRecordService medicalService;
    @Autowired
    private UserService userService;
    
    @GetMapping("/api/nurse/invoices/")
    public ResponseEntity<List<Object[]>> getInvoices() {
        return new ResponseEntity<>(this.invoiceService.getInvoices(), HttpStatus.OK);
    }
    
    @GetMapping(path = "/api/nurse/invoices/{id}/", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Invoice> getInvoicesById(@PathVariable(value = "id") int id) {
        return new ResponseEntity<>(this.invoiceService.getInvoiceById(id), HttpStatus.OK);
    }
    
    @GetMapping(value = "/api/nurse/invoices/prescription/{id}/", produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<List<Object[]>> prescriptionsByInvoiceId(@PathVariable(value = "id") int id) {
        Invoice i = this.invoiceService.getInvoiceById(id);
        return new ResponseEntity<>(this.prescriptionSv.getPrescirptionForDetailInvoice(i.getMedicalRecordId()),
                HttpStatus.OK);
    }
    
    @GetMapping(value = "/api/nurse/invoices/fee/{id}/", produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<int[]> totalFeeByInvoiceId(@PathVariable(value = "id") int id) {
        Invoice i = this.invoiceService.getInvoiceById(id);
        int examinationFee = this.medicalService.getMedicalRecordById(i.getMedicalRecordId().getId()).getExaminationFee().intValue();
        int prescriptionFee =  this.prescriptionSv.totalMedicine(this.medicalService.getMedicalRecordById(i.getMedicalRecordId().getId())).intValue();
        return new ResponseEntity<>(new int[]{examinationFee, prescriptionFee},
                HttpStatus.OK);
    }
    
    @PostMapping(value = "/api/nurse/invoices/payment/{id}/")
    public ResponseEntity<Message> paymentDirect(@PathVariable(value = "id") int invoiceId,
            Principal user) {
        Invoice i = this.invoiceService.getInvoiceById(invoiceId);
        i.setPaymentStatus(Invoice.ACCEPTED);
        User nurse = this.userService.getCurrentUser(user.getName());
        i.setNurseId(nurse);
        Message m = new Message();
        if (this.invoiceService.payment(i)) {
            m.setMessage("Thanh toán thành công.");
            m.setData(i);
            return new ResponseEntity<>(m, HttpStatus.OK);
        }
        m.setMessage("Thanh toán thất bại. Vui lòng thử lại");
        return new ResponseEntity<>(m, HttpStatus.OK);
    }
}
