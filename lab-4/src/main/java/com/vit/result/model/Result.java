package com.vit.result.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "results")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "subject_code", nullable = false)
    private String subjectCode;

    @Column(name = "subject_name", nullable = false)
    private String subjectName;

    @Column(name = "mse_marks", nullable = false)
    private double mseMarks;

    @Column(name = "ese_marks", nullable = false)
    private double eseMarks;

    @Column(name = "final_marks")
    private double finalMarks;

    @Column(name = "grade")
    private String grade;

    public void calculateFinalScore() {
        // MSE: 30%, ESE: 70%
        this.finalMarks = Math.round(((this.mseMarks * 0.30) + (this.eseMarks * 0.70)) * 100.0) / 100.0;
        this.grade = deriveGrade(this.finalMarks);
    }

    private String deriveGrade(double marks) {
        if (marks >= 90) return "S";
        if (marks >= 80) return "A";
        if (marks >= 70) return "B";
        if (marks >= 60) return "C";
        if (marks >= 50) return "D";
        if (marks >= 40) return "E";
        return "F";
    }
}