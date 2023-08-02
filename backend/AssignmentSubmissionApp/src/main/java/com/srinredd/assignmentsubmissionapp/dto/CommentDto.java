package com.srinredd.assignmentsubmissionapp.dto;

public class CommentDto {
    private long assignmentId;
    private String text;
    private String User;

    public long getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(long assignmentId) {
        this.assignmentId = assignmentId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getUser() {
        return User;
    }

    public void setUser(String user) {
        User = user;
    }

    @Override
    public String toString() {
        return "CommentDto{" +
                "assignmentId=" + assignmentId +
                ", text='" + text + '\'' +
                ", User='" + User + '\'' +
                '}';
    }
}
