package com.polisual;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class PolisualApplication {
    public static void main(String[] args) {
        SpringApplication.run(PolisualApplication.class, args);
    }
}
