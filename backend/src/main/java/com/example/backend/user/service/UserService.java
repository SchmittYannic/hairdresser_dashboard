package com.example.backend.user.service;

import com.example.backend.common.domain.model.User;
import com.example.backend.user.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Collation;
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

    public Page<UserDTO> getUsers(int offset, int limit, String sortField, String sortOrder,
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
            List<List<String>> validRoleCombinations = new ArrayList<>();

            if (roles.contains("User")) {
                validRoleCombinations.add(List.of("User"));
            }
            if (roles.contains("Employee")) {
                validRoleCombinations.add(List.of("User", "Employee"));
            }
            if (roles.contains("Admin")) {
                validRoleCombinations.add(List.of("User", "Employee", "Admin"));
            }

            List<Criteria> roleCriteriaList = validRoleCombinations.stream()
                    .map(combination -> Criteria.where("roles").is(combination))
                    .toList();

            if (!roleCriteriaList.isEmpty()) {
                filters.add(new Criteria().orOperator(roleCriteriaList.toArray(new Criteria[0])));
            }
        }

        if (!filters.isEmpty()) {
            criteria = new Criteria().andOperator(filters.toArray(new Criteria[0]));
        }

        Collation collation = Collation.of("en").strength(Collation.ComparisonLevel.secondary());

        Query query = new Query(criteria);
        query.with(pageable).collation(collation);
        query.fields().exclude("password");

        List<User> users = mongoTemplate.find(query, User.class);
        long count = mongoTemplate.count(new Query(criteria), User.class);

        List<UserDTO> userDTOs = users.stream().map(user -> UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .roles(user.getRoles())
                .title(user.getTitle())
                .lastname(user.getLastname())
                .firstname(user.getFirstname())
                .birthday(user.getBirthday())
                .phonenumber(user.getPhonenumber())
                .validated(user.isValidated())
                .reminderemail(user.isReminderemail())
                .birthdayemail(user.isBirthdayemail())
                .newsletter(user.isNewsletter())
                .build()
        ).toList();

        return new PageImpl<>(userDTOs, pageable, count);
    }
}
