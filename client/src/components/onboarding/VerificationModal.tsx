import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, UploadCloud, FileText, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VerificationModal({ isOpen, onClose }: VerificationModalProps) {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep(s => s + 1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden gap-0 bg-white">
        {/* Header Progress */}
        <div className="bg-brand-navy p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
             <ShieldCheck size={18} />
             <span className="text-xs font-bold uppercase tracking-wider">Official Verification</span>
          </div>
          <DialogTitle className="text-2xl font-heading font-bold text-white">Verify Ownership</DialogTitle>
          <DialogDescription className="text-brand-navy-light">
             Step {step} of 3: {step === 1 ? "Declarations" : step === 2 ? "Document Upload" : "Review"}
          </DialogDescription>
          
          {/* Progress Bar */}
          <div className="h-1 bg-brand-navy-light/30 mt-4 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-brand-gold"
              initial={{ width: "33%" }}
              animate={{ width: `${step * 33.33}%` }}
            />
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/20 transition-colors">
                    <Checkbox id="terms1" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="terms1" className="text-sm font-medium text-brand-navy">
                        I am the contract holder
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        I confirm that I am named on the original Purchase of Sale Agreement.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/20 transition-colors">
                    <Checkbox id="terms2" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="terms2" className="text-sm font-medium text-brand-navy">
                        Developer Restrictions
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        I have reviewed the developer's disclosure statement regarding assignments.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <h4 className="font-bold text-brand-navy text-sm mb-2 flex items-center gap-2">
                    <FileText size={16} />
                    Redaction Instructions
                  </h4>
                  <div className="flex gap-4">
                     <div className="w-1/3 bg-white p-2 shadow-sm border rounded">
                        {/* Placeholder for the redacted image asset */}
                        <img src="/attached_assets/generated_images/redacted_legal_contract_document.png" className="w-full h-24 object-cover opacity-80" />
                     </div>
                     <ul className="text-xs text-muted-foreground space-y-2 flex-1">
                       <li className="flex items-center gap-2 text-green-700">
                         <Check size={12} /> Keep Visible: Name, Unit #, Developer
                       </li>
                       <li className="flex items-center gap-2 text-red-700">
                         <span className="font-bold">X</span> Cross Out: SIN, Bank Details
                       </li>
                     </ul>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer hover:border-brand-navy/50 hover:bg-brand-navy/5 transition-all group">
                  <div className="bg-secondary p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                    <UploadCloud className="text-brand-navy" size={24} />
                  </div>
                  <span className="text-sm font-medium text-brand-navy">Click to upload PDF or Image</span>
                  <span className="text-xs text-muted-foreground">Max 5MB</span>
                </div>
              </motion.div>
            )}
            
            {step === 3 && (
               <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="text-green-600 w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-xl text-brand-navy mb-2">Ready to Submit?</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Our compliance team will review your document within 24 hours. Your listing will receive the "Verified Owner" badge upon approval.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="p-6 pt-0 bg-gray-50/50 border-t border-border flex justify-between items-center">
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground">
            Cancel
          </Button>
          <Button 
            onClick={step === 3 ? onClose : handleNext}
            className="bg-brand-navy hover:bg-brand-navy-light text-white px-8 shadow-lg shadow-brand-navy/20"
          >
            {step === 3 ? "Submit for Review" : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
