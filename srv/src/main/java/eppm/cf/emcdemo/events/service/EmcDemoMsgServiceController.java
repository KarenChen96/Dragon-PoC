package eppm.cf.emcdemo.events.service;


import eppm.cf.emcdemo.events.model.EmcDemoProjectEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jms.annotation.JmsListener;

import javax.validation.Valid;

public class EmcDemoMsgServiceController {

    private static final Logger log = LoggerFactory.getLogger(EmcDemoMsgServiceController.class);

    @JmsListener(destination = "queue:e1y")

    public void onReceivedMessage (@Valid EmcDemoProjectEvent event){
        log.info("Received the message from S/4HANA Enterprise Message");
        log.debug("Handle BusinessPartnerEvent: {}", event);
        String projectId = event.getPayload().getBusinessPartnerKey();
    }
}
