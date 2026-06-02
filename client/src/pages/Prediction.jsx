import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Stethoscope, Info, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "@/utils/api";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  symptoms: z.array(z.string()).min(1, "Please select at least one symptom."),
});

const Prediction = () => {
  const [result, setResult] = useState(null);
  const [symptomsList, setSymptomsList] = useState([]);
  const [loadingSymptoms, setLoadingSymptoms] = useState(true);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await api.get("/disease/symptoms");
        setSymptomsList(response.data.data.symptoms);
      } catch (error) {
        toast.error(
          `❌ Error fetching symptoms: ${
            error.response?.data?.error || error.message
          }`
        );
      } finally {
        setLoadingSymptoms(false);
      }
    };

    fetchSymptoms();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: [],
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await api.post("/disease/predict", {
        symptoms: values.symptoms,
      });

      setResult(response.data.data.prediction || "Disease not found");
    } catch (error) {
      toast.error(`❌ Error: ${error.response?.data?.error || error.message}`);
      setResult(null);
    }
  };

  const handleSelectSymptom = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      const newSelectedSymptoms = [...selectedSymptoms, symptom];
      setSelectedSymptoms(newSelectedSymptoms);
      form.setValue("symptoms", newSelectedSymptoms);
      setInputValue(""); // Clear input after selection
    }
  };

  const handleRemoveSymptom = (symptomToRemove) => {
    const newSelectedSymptoms = selectedSymptoms.filter(
      (symptom) => symptom !== symptomToRemove
    );
    setSelectedSymptoms(newSelectedSymptoms);
    form.setValue("symptoms", newSelectedSymptoms);
  };

  const filteredSymptoms = symptomsList.filter(
    (symptom) =>
      symptom.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedSymptoms.includes(symptom)
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 gap-6">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Stethoscope className="text-blue-500 dark:text-blue-400" />
            <CardTitle className="text-2xl font-bold">
              Disease Predictor
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground pt-1">
            Select your symptoms from the list below.
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptoms</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="w-full">
                          <Command className="w-full border rounded-md">
                            <CommandInput
                              placeholder="Search for symptoms..."
                              value={inputValue}
                              onValueChange={setInputValue}
                            />
                            <CommandList>
                              <CommandEmpty>No symptoms found.</CommandEmpty>
                              <CommandGroup heading="Available Symptoms">
                                {filteredSymptoms.map((symptom) => (
                                  <CommandItem
                                    key={symptom}
                                    onSelect={() =>
                                      handleSelectSymptom(symptom)
                                    }
                                  >
                                    {symptom}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {selectedSymptoms.map((symptom) => (
                            <Badge
                              key={symptom}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {symptom}
                              <button
                                type="button"
                                onClick={() => handleRemoveSymptom(symptom)}
                                className="ml-1"
                              >
                                <XCircle className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full font-semibold"
                disabled={form.formState.isSubmitting || loadingSymptoms}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />{" "}
                    Predicting...
                  </>
                ) : (
                  "Predict"
                )}
              </Button>
            </form>
          </Form>
          {result && (
            <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900/30 text-center rounded-md">
              <p className="text-lg font-semibold">🧠 Prediction Result:</p>
              <p className="text-xl text-blue-700 dark:text-blue-300 font-bold">
                {result}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Common Diseases Card - Kept as is for now */}
      <Card className="w-full max-w-xl shadow-md border dark:border-zinc-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Common Diseases
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-5 w-5 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent className="text-sm max-w-xs">
                This is a list of frequently encountered diseases for your
                reference.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
            {/* This list could potentially be fetched from the backend or a static list */}
            {[
              "Diabetes",
              "Hypertension",
              "Malaria",
              "Dengue",
              "Tuberculosis",
              "Asthma",
              "COVID-19",
              "Typhoid",
              "Anemia",
              "Pneumonia",
            ].map((disease, index) => (
              <li key={index} className="pl-4 list-disc">
                {disease}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Prediction;
