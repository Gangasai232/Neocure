import React from "react";
import { Phone, Mail, MapPin, ShieldAlert, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Support = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-10 px-4 space-y-10">
      <Card className="w-full max-w-3xl shadow-md bg-card text-foreground">
        <CardContent className="py-6 space-y-5">
          <h1 className="text-3xl font-semibold text-center text-primary">
            Support & Help
          </h1>
          <p className="text-muted-foreground text-center">
            We're here to assist you. Reach out to us through the contacts
            below.
          </p>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-destructive w-6 h-6" />
              <div>
                <p className="font-semibold text-destructive">
                  Emergency Helpline
                </p>
                <p className="text-muted-foreground">+91 911-100-1000</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-blue-500 dark:text-blue-400 w-6 h-6" />
              <div>
                <p className="font-semibold">General Inquiry</p>
                <p className="text-muted-foreground">+91 98765-43210</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-green-500 dark:text-green-400 w-6 h-6" />
              <div>
                <p className="font-semibold">Email Support</p>
                <p className="text-muted-foreground">support@healthhub.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-purple-500 dark:text-purple-400 w-6 h-6" />
              <div>
                <p className="font-semibold">Hospital Address</p>
                <p className="text-muted-foreground">
                  HealthHub Hospital, Main Street, Hyderabad
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="w-full max-w-3xl shadow-md bg-card text-foreground">
        <CardContent className="py-6 space-y-5">
          <div className="flex items-center gap-2 justify-center">
            <HelpCircle className="text-yellow-500 w-6 h-6" />
            <h2 className="text-2xl font-semibold text-primary">
              Frequently Asked Questions
            </h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I book an appointment?</AccordionTrigger>
              <AccordionContent>
                You can book an appointment through the "Appointments" page once
                your patient profile is set up.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                Can I reschedule or cancel my booking?
              </AccordionTrigger>
              <AccordionContent>
                Yes, you can reschedule or cancel through your appointment
                dashboard up to 24 hours in advance.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                What if I can't find my doctor?
              </AccordionTrigger>
              <AccordionContent>
                Please contact general support at +91 98765-43210 for help in
                locating or assigning a doctor.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                How do I update my profile or medical history?
              </AccordionTrigger>
              <AccordionContent>
                Go to your account page and update your personal and health
                information as needed.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
