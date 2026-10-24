package com.vit.result.controller;

import com.vit.result.model.Result;
import com.vit.result.model.ResultForm;
import com.vit.result.model.Student;
import com.vit.result.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/results")
public class ResultController {

    @Autowired
    private ResultService resultService;

    @GetMapping("/")
    public String index() {
        return "redirect:/results/input";
    }

    @GetMapping("/input")
    public String showInputForm(Model model) {
        ResultForm form = new ResultForm();
        form.setSemester(4);

        String[][] defaultSubjects = {
            {"CSE2001", "Database Management Systems"},
            {"CSE2002", "Operating Systems"},
            {"CSE2003", "Computer Networks"},
            {"CSE2004", "Design & Analysis of Algorithms"}
        };

        for (String[] sub : defaultSubjects) {
            Result res = new Result();
            res.setSubjectCode(sub[0]);
            res.setSubjectName(sub[1]);
            form.getResults().add(res);
        }

        model.addAttribute("form", form);
        return "input-form";
    }

    @PostMapping("/submit")
    public String processResult(@ModelAttribute("form") ResultForm form) {
        Student savedStudent = resultService.saveStudentForm(form);
        return "redirect:/results/view/" + savedStudent.getRegistrationNumber();
    }

    @GetMapping("/view/{regNo}")
    public String viewResult(@PathVariable String regNo, Model model) {
        Student student = resultService.getStudentByRegNo(regNo);
        if (student == null) {
            return "error";
        }

        double totalFinalMarks = student.getResults().stream()
                .mapToDouble(Result::getFinalMarks)
                .sum();
        double gpa = (totalFinalMarks / (student.getResults().size() * 100.0)) * 10.0;

        model.addAttribute("student", student);
        model.addAttribute("gpa", String.format("%.2f", gpa));
        return "result-view";
    }
}