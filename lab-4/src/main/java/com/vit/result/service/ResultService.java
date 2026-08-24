package com.vit.result.service;

import com.vit.result.model.Result;
import com.vit.result.model.ResultForm;
import com.vit.result.model.Student;
import com.vit.result.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class ResultService {

    @Autowired
    private StudentRepository studentRepository;

    @Transactional
    public Student saveStudentForm(ResultForm form) {
        String regNo = form.getRegistrationNumber().trim();
        Optional<Student> existingOpt = studentRepository.findByRegistrationNumber(regNo);

        Student student = existingOpt.orElse(new Student());
        student.setRegistrationNumber(regNo);
        student.setStudentName(form.getStudentName());
        student.setSemester(form.getSemester());

        if (student.getResults() == null) {
            student.setResults(new ArrayList<>());
        } else {
            student.getResults().clear();
        }

        for (Result res : form.getResults()) {
            res.setStudent(student);
            res.calculateFinalScore();
            student.getResults().add(res);
        }

        return studentRepository.save(student);
    }

    @Transactional(readOnly = true)
    public Student getStudentByRegNo(String regNo) {
        return studentRepository.findByRegistrationNumber(regNo.trim()).orElse(null);
    }
}