package com.srinredd.assignmentsubmissionapp.repository;

import com.srinredd.assignmentsubmissionapp.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

}
