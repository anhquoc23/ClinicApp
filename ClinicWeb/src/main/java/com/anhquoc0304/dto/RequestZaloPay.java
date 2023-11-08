/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.anhquoc0304.dto;

import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author Admin
 */
@Setter
@Getter
public class RequestZaloPay {
    private int appId;
    private String appUser;
    private long appTime;
    private BigDecimal amount;
    private String appTransid;
    private String embeddata;
    private String item;
    private String mac;
    private String bankcode;
    private String description;
    private String address;
    private String email;
    private String phone;
    
    
}