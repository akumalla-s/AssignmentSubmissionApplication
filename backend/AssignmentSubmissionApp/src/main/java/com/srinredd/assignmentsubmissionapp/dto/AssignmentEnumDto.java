package com.srinredd.assignmentsubmissionapp.dto;

public class AssignmentEnumDto {
    private String assignmentName;
    private Integer assignmentNum;

    public AssignmentEnumDto(String assignmentName, Integer assignmentNum) {
        this.assignmentName = assignmentName;
        this.assignmentNum = assignmentNum;
    }

    public String getAssignmentName() {
        return assignmentName;
    }

    public void setAssignmentName(String assignmentName) {
        this.assignmentName = assignmentName;
    }

    public Integer getAssignmentNum() {
        return assignmentNum;
    }

    public void setAssignmentNum(Integer assignmentNum) {
        this.assignmentNum = assignmentNum;
    }
}
