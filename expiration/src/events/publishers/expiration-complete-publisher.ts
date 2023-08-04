import { ExpirationCompleteEvent, Publisher, Subjects } from "@gbotickets/common";



export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	readonly subject = Subjects.expirationComplete;

}