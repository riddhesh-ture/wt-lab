package com.vit.result.model;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class ResultForm {
    private String studentName;
    private String registrationNumber;
    private int semester;
    private List<Result> results = new ArrayList<>();
}