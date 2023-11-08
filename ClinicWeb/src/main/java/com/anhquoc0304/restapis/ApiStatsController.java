/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.anhquoc0304.restapis;

import com.anhquoc0304.service.StatService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Admin
 */
@RestController
@CrossOrigin
public class ApiStatsController {
     @Autowired
    private StatService statService;
    @GetMapping("/api/admin/stats/count-patients/")
    public ResponseEntity<Integer> countPatient() {
        return new ResponseEntity<>(this.statService.countPatients(),
                HttpStatus.OK);
    }
    
    @GetMapping("/api/admin/stats/total-revenues/")
    public ResponseEntity<BigDecimal> totalRevenues() {
        BigDecimal stat = this.statService.totalRevenue();
        return new ResponseEntity<>(stat, HttpStatus.OK);
    }
    
    @GetMapping("/api/admin/stats/count-medical/")
    public ResponseEntity<Integer> countMedical() {
        return new ResponseEntity<>(this.statService.countMedical(),
        HttpStatus.OK);
    }
    
    @GetMapping(value = "/api/admin/stats/stat-revenue/",
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<List<Object[]>> statRevenue(@RequestParam(value = "date",
            required = false) 
    @DateTimeFormat(pattern = "yyyy-MM-dd") Date date,
            @RequestParam(value = "typeStat") int type) {
        if(date == null)
            date = new Date();
        LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        System.out.println(localDate.getMonthValue());
        return new ResponseEntity<>(this.statService.statRevenue(localDate, type),
        HttpStatus.OK);
    }
    
    @GetMapping(value = "/api/admin/stats/medicine-stats/{type}/",
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<List<Object[]>> top5MedicineStat(@PathVariable(value = "type") int type) {
        if (type == 0) {
            return new ResponseEntity<>(this.statService.top5MedicineStat(true),
            HttpStatus.OK);
        }
        return new ResponseEntity<>(this.statService.top5MedicineStat(false),
            HttpStatus.OK);
    }
    
    @GetMapping(value = "/api/admin/stats/amount-patient/",
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<List<Object[]>> statAmountPatient(@RequestParam(value = "date") @DateTimeFormat(pattern = "yyyy-MM-dd") Date date,
            @RequestParam(value = "typeStat") int type) {
        LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        return new ResponseEntity<>(this.statService.statAmountPatient(localDate, type),
        HttpStatus.OK);
    }
}
