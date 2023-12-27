package propensi.b04.siperpus;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@OpenAPIDefinition(servers = {
//		Uncomment this when deploying
		@Server(url = "https://si-perpus-smp131jakarta.herokuapp.com"),

//		Uncomment this when running locally
//		@Server(url = "/"),
}, 		info = @Info(
			title = "Si-Perpus API",
			description = "Berikut adalah API-API dari Backend Si-Perpus",
			version = "v1"
			))
@SecurityScheme(
		name = "bearerAuth",
		type = SecuritySchemeType.HTTP,
		bearerFormat = "JWT",
		scheme = "bearer"
)
@SpringBootApplication
public class SiperpusApplication {
	public static void main(String[] args) {
		SpringApplication.run(SiperpusApplication.class, args);
	}
}
