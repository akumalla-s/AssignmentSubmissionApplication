package com.srinredd.assignmentsubmissionapp.service;

import com.srinredd.assignmentsubmissionapp.dto.AssignmentResponseDto;
import com.srinredd.assignmentsubmissionapp.dto.CommentDto;
import com.srinredd.assignmentsubmissionapp.model.Assignment;
import com.srinredd.assignmentsubmissionapp.model.Comment;
import com.srinredd.assignmentsubmissionapp.model.User;
import com.srinredd.assignmentsubmissionapp.repository.AssignmentRepository;
import com.srinredd.assignmentsubmissionapp.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    public Comment save(CommentDto commentDto, User user) {
        Comment comment = new Comment();
        Assignment assignment = assignmentRepository.getReferenceById(commentDto.getAssignmentId());

        comment.setText(commentDto.getText());
        comment.setAssignment(assignment);
        comment.setCreatedBy(user);
        comment.setCreatedDate(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    public Set<Comment> getCommentsByAssignmentId(Long assignmentId) {
        Set<Comment> comments = commentRepository.findByAssignmentId(assignmentId);
        return comments;
    }
}
