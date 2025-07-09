package com.example.backend.user.service;

import com.example.backend.common.domain.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private final MongoTemplate mongoTemplate;

    @Autowired
    public UserService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public Page<User> getUsers(int offset, int limit, String sortField, String sortOrder,
                               String lastname, String firstname, List<String> roles) {

        Pageable pageable = PageRequest.of(offset / limit, limit,
                sortOrder.equalsIgnoreCase("desc") ? Sort.by(sortField).descending() : Sort.by(sortField).ascending());

        Criteria criteria = new Criteria();
        List<Criteria> filters = new ArrayList<>();

        if (lastname != null && !lastname.isEmpty()) {
            filters.add(Criteria.where("lastname").regex(lastname, "i"));
        }
        if (firstname != null && !firstname.isEmpty()) {
            filters.add(Criteria.where("firstname").regex(firstname, "i"));
        }
        if (roles != null && !roles.isEmpty()) {
            filters.add(Criteria.where("roles").in(roles));
        }

        if (!filters.isEmpty()) {
            criteria = new Criteria().andOperator(filters.toArray(new Criteria[0]));
        }

        Query query = new Query(criteria).with(pageable);

        List<User> users = mongoTemplate.find(query, User.class);
        long count = mongoTemplate.count(new Query(criteria), User.class);

        return new PageImpl<>(users, pageable, count);
    }
}
