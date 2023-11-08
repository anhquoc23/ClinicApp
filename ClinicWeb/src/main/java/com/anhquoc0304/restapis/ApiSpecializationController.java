/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.anhquoc0304.restapis;

import com.anhquoc0304.dto.Message;
import com.anhquoc0304.pojo.Category;
import com.anhquoc0304.pojo.Specialization;
import com.anhquoc0304.service.SpecializationService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Admin
 */
@RestController
@CrossOrigin
public class ApiSpecializationController {
    @Autowired
    SpecializationService specialService;
    
    @GetMapping("/api/specialization/lists/")
    public ResponseEntity<List<Specialization>> getSpecializations() {
        return new ResponseEntity<>(this.specialService.getSpecials(), HttpStatus.OK);
    }
    
    @DeleteMapping("/api/admin/special/delete/{id}/")
    public ResponseEntity<Message> deleteSpecialization(@PathVariable(value = "id") int id) {
        Specialization s = this.specialService.getSpecializationById(id);
        Message message = new Message();
        if (this.specialService.deleteSpecialization(s)) {
            message.setMessage("Xoá khoa thành công.");
            message.setData(s);
            return new ResponseEntity<>(message, HttpStatus.OK);
        }
        message.setMessage("Xoá không thành công. Vui lòng thử lại.");
        return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @PostMapping("/api/admin/special/add/")
    public ResponseEntity<Message> addSpecialization(@RequestBody Specialization s) {
        Message message = new Message();
        if (this.specialService.addSpecialization(s)) {
            message.setMessage("thêm thành công.");
            message.setData(s);
            return new ResponseEntity<>(message, HttpStatus.OK);
        }
        message.setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
        return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
