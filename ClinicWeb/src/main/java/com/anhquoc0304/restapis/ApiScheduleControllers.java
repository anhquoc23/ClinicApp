/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.anhquoc0304.restapis;

import com.anhquoc0304.dto.Message;
import com.anhquoc0304.pojo.Room;
import com.anhquoc0304.pojo.Schedule;
import com.anhquoc0304.service.RoomService;
import com.anhquoc0304.service.ScheduleService;
import com.anhquoc0304.service.UserService;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Admin
 */
@RestController
@CrossOrigin
public class ApiScheduleControllers {
    @Autowired
    private RoomService roomService;
    @Autowired
    private ScheduleService scheduleService;
    @Autowired
    private UserService userService;
    
    @GetMapping("/api/admin/rooms/")
    public ResponseEntity<List<Room>> getRooms() {
        return new ResponseEntity<>(this.roomService.getRooms(),
                HttpStatus.OK);
    }
    
    @DeleteMapping("/api/admin/room/delete/{id}/")
    public ResponseEntity<Message> deleteRoom(@PathVariable(value = "id") int id) {
        Room r = this.roomService.getRoomById(id);
        Message message = new Message();
        if (this.roomService.deleteRoom(r)) {
            message.setMessage("Xoá phòng thành công.");
            message.setData(r);
            return new ResponseEntity<>(message, HttpStatus.OK);
        }
        message.setMessage("Xoá không thành công. Vui lòng thử lại.");
        return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @PostMapping("/api/admin/room/add/")
    public ResponseEntity<Message> addRoom(@RequestBody Room r) {
        Message message = new Message();
        if (this.roomService.addRoom(r)) {
            message.setMessage("thêm thành công.");
            message.setData(r);
            return new ResponseEntity<>(message, HttpStatus.OK);
        }
        message.setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
        return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @PostMapping(value = "/api/admin/schedule/add/"
            , produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Message> addSchedule(@RequestParam Map<String, String> schedule,
            @RequestParam(value = "scheduleDate") @DateTimeFormat(pattern = "yyyy-MM-dd") Date date,
            @RequestParam(value = "shiftStart") @DateTimeFormat(pattern = "HH:mm") Date start,
            @RequestParam(value = "shiftEnd") @DateTimeFormat(pattern = "HH:mm") Date end) throws ParseException {
        Schedule s = new Schedule();
        s.setRoomId(this.roomService.getRoomById(Integer.parseInt(schedule.get("roomId"))));
        s.setScheduleDate(date);
        s.setShiftEnd(end);
        s.setShiftStart(start);
        s.setUserId(this.userService.getUserById(Integer.parseInt(schedule.get("userId"))));
        Message m = new Message();
        if(this.scheduleService.addSchedule(s))
        {
            m.setMessage("Tạo lịch thành công");
            m.setData(s);
            return new ResponseEntity<>(m, HttpStatus.CREATED);
        }
        m.setMessage("Tạo thất bại");
        return new ResponseEntity<>(m, HttpStatus.BAD_REQUEST);
    }
    
    @GetMapping("/api/employee/schedule/view/")
    public ResponseEntity<List<Object[]>> getSchedules(@RequestParam(value = "date",
            required = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {
        if(date == null)
            date = new Date();
        return new ResponseEntity<>(this.scheduleService.getScheduleByDate(date),
        HttpStatus.OK);
    }
    
}
