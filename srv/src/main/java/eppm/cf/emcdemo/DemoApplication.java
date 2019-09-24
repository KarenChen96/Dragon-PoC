package eppm.cf.emcdemo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan({"com.sap.cloud.sdk.s4hana.datamodel.odata.services", "eppm.cf.emcdemo"})
@ServletComponentScan({"com.sap.cloud.sdk.s4hana.datamodel.odata.services", "eppm.cf.emcdemo"})
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}
}
