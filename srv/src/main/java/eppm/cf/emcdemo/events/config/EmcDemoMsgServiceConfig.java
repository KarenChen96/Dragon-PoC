package eppm.cf.emcdemo.events.config;

import com.sap.cloud.servicesdk.xbem.connector.sapcp.MessagingServiceInfoProperties;
import com.sap.cloud.servicesdk.xbem.core.MessagingService;
import com.sap.cloud.servicesdk.xbem.core.MessagingServiceFactory;
import com.sap.cloud.servicesdk.xbem.core.exception.MessagingException;
import com.sap.cloud.servicesdk.xbem.core.impl.MessagingServiceFactoryCreator;
import com.sap.cloud.servicesdk.xbem.extension.sapcp.jms.MessagingServiceJmsConnectionFactory;
import com.sap.cloud.servicesdk.xbem.extension.sapcp.jms.MessagingServiceJmsSettings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.Cloud;
import org.springframework.cloud.CloudFactory;
import org.springframework.cloud.service.ServiceConnectorConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.jms.config.DefaultJmsListenerContainerFactory;

import javax.jms.Session;


@EnableJms
@Configuration
@Profile("cloud")
public class EmcDemoMsgServiceConfig {

    private static final Logger log = LoggerFactory.getLogger(EmcDemoMsgServiceConfig.class);


    @Bean
    public MessagingServiceFactory getMessagingServiceFactory() {
        ServiceConnectorConfig config = MessagingServiceInfoProperties.init().finish();
        Cloud cloud = new CloudFactory().getCloud();
        // get the MessagingService via the service connector
        MessagingService messagingService = cloud.getSingletonServiceConnector(MessagingService.class, config);
        if (messagingService == null) {
            throw new IllegalStateException("Unable to create the MessagingService.");
        }
        return MessagingServiceFactoryCreator.createFactory(messagingService);
    }


    @Bean
    @Autowired
    public MessagingServiceJmsConnectionFactory getMessagingServiceJmsConnectionFactory(MessagingServiceFactory messagingServiceFactory) {
        try {
            /*
             * The settings object is preset with default values (see JavaDoc)
             * and can be adjusted. The settings aren't required and depend on
             * the use-case. Note: a connection will be closed after an idle
             * time of 5 minutes.
             */
            MessagingServiceJmsSettings settings = new MessagingServiceJmsSettings();
            settings.setMaxReconnectAttempts(5); // use -1 for unlimited attempts
            settings.setInitialReconnectDelay(3000);
            settings.setReconnectDelay(3000);
            return messagingServiceFactory.createConnectionFactory(MessagingServiceJmsConnectionFactory.class, settings);
        } catch (MessagingException e) {
            throw new IllegalStateException("Unable to create the Connection Factory", e);
        }
    }

    @Bean
    public DefaultJmsListenerContainerFactory jmsListenerContainerFactory(MessagingServiceJmsConnectionFactory messageServiceJmsConnectionFactory) {


        log.info("Initialized the default JmsListenerContainerFactory");

        try {

//			final JmsConnectionFactory connectionFactory = messagingService.configure(JmsConnectionFactory.class);

//			messagingServiceFactory.setRemoteURI(String.format(REMOTE_URI_WITH_FAILOVER, messagingServiceFactory.getRemoteURI()));

            DefaultJmsListenerContainerFactory factory = new DefaultJmsListenerContainerFactory();
            factory.setConnectionFactory(messageServiceJmsConnectionFactory);
            factory.setSessionAcknowledgeMode(Session.AUTO_ACKNOWLEDGE);

            // Necessary to get it work with enterprise messaging
            factory.setSessionTransacted(false);

            // Enable deserialization of events to Java types
//			factory.setMessageConverter(messageConverter);

            // Log all errors
            factory.setErrorHandler(e -> log.warn("JMS error: the message is dropped", e));

            return factory;
        } catch (Exception e) {
            log.error("Error while initializing the default JmsListenerContainerFactory. Events from S/4HANA will NOT be processed", e);
            throw e;
        }
    }
}
