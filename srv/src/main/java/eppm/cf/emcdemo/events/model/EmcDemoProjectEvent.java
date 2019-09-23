package eppm.cf.emcdemo.events.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Collection;
import java.util.Collections;

public class EmcDemoProjectEvent extends EmcDemoMsgEvent<EmcDemoProjectEvent.Payload>  {

//  public static final String JSON_TYPE_ID_CREATED = "BO.BusinessPartner.Created";
//	public static final String JSON_TYPE_ID_CHANGED = "BO.BusinessPartner.Changed";

	/**
	 * Example JSON object:
	 *
	 * {"KEY":[{"PROJECTID":"9980021470"}]}}
	 *
	 */
	public static class Payload {

		public static class ProjectID {
			@NotNull
			@JsonProperty("PROJECTID")
			protected String projectID;

			@Override
			public String toString() {
				return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
			}

		}

		@Valid
		@NotNull
		@Size(min = 1, max = 1)
		@JsonProperty("KEY")
		protected Collection<@NotNull ProjectID> keys;

		public String getProjectKey() {
			return keys.iterator().next().projectID;
		}

		public void setProjectKey(String projectID) {
			final ProjectID id = new ProjectID();
			id.projectID = projectID;
			keys = Collections.singletonList(id);
		}

		@Override
		public String toString() {
			return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
		}

	}

	@NotNull
	@Valid
	@Override
	public Payload getPayload() {
		return super.getPayload();
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
	}

}
