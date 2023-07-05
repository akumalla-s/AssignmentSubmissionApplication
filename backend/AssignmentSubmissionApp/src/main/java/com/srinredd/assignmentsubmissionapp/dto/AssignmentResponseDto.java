package com.srinredd.assignmentsubmissionapp.dto;

import com.srinredd.assignmentsubmissionapp.enums.AssignmentEnum;
import com.srinredd.assignmentsubmissionapp.model.Assignment;

public class AssignmentResponseDto {
    private Assignment assignment;
    private AssignmentEnum[] assignmentEnums = AssignmentEnum.values();

    public AssignmentResponseDto(Assignment assignment) {
        this.assignment = assignment;
    }

    public Assignment getAssignment() {
        return assignment;
    }

    public void setAssignment(Assignment assignment) {
        this.assignment = assignment;
    }

    public AssignmentEnum[] getAssignmentEnums() {
        return assignmentEnums;
    }
}
