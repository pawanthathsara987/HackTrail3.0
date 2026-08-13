import React, { useState } from "react";
import {
  X,
  CreditCard,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  User,
  Clock,
  Sparkles,
  Receipt,
} from "lucide-react";

const FreelancePaymentModal = ({
  isOpen,
  onClose,
  activityDetails, // { id, title, amount, freelancerName, category, type: 'gig' | 'proposal', proposalId }
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("card"); // "card" | "paypal"
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [receiptData, setReceiptData] = useState(null);

  const [cardForm, setCardForm] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });

  if (!isOpen || !activityDetails) return null;

  const numericAmount =
    parseFloat(
      String(activityDetails.amount || "0")
        .replace(/[^0-9.]/g, "")
    ) || 50;

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    val = val.substring(0, 16);
    val = val.replace(/(.{4})/g, "$1 ").trim();
    setCardForm((prev) => ({ ...prev, cardNumber: val }));
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    val = val.substring(0, 4);
    if (val.length >= 3) {
      val = `${val.substring(0, 2)}/${val.substring(2)}`;
    }
    setCardForm((prev) => ({ ...prev, expiryDate: val }));
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setError("");

    if (paymentMethod === "card") {
      if (!cardForm.cardholderName.trim()) {
        setError("Please enter the cardholder name.");
        return;
      }
      if (cardForm.cardNumber.replace(/\s/g, "").length < 15) {
        setError("Please enter a valid 16-digit card number.");
        return;
      }
      if (cardForm.expiryDate.length < 5) {
        setError("Please enter a valid expiry date (MM/YY).");
        return;
      }
      if (cardForm.cvc.length < 3) {
        setError("Please enter a valid CVC code.");
        return;
      }
    }

    try {
      setIsProcessing(true);
      const token = localStorage.getItem("token");

      let endpoint = `/api/freelance-projects/${activityDetails.id}/pay-and-hire`;
      if (activityDetails.type === "proposal" && activityDetails.proposalId) {
        endpoint = `/api/freelance-projects/proposals/${activityDetails.proposalId}/pay-and-hire`;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: numericAmount,
          paymentMethod: paymentMethod === "card" ? "Credit / Debit Card" : "PayPal Instant",
          cardDetails: {
            cardholderName: cardForm.cardholderName,
            lastFour: cardForm.cardNumber.slice(-4),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to process payment.");
      }

      const receipt = {
        transactionId: data.transactionId || `TXN-${Date.now()}`,
        amount: data.paidAmount || numericAmount,
        paidAt: data.paidAt || new Date().toISOString(),
        paymentMethod: paymentMethod === "card" ? "Credit Card (Visa / Mastercard)" : "PayPal",
        title: activityDetails.title,
        freelancerName: activityDetails.freelancerName,
      };

      setReceiptData(receipt);
      if (onPaymentSuccess) {
        onPaymentSuccess(receipt);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl my-8 border border-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <CreditCard size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Checkout & Hire Student
              </h3>
              <p className="text-xs text-slate-500">
                Securely pay for this freelancing activity
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* RECEIPT VIEW IF PAID */}
        {receiptData ? (
          <div className="py-6 text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                Payment Successful
              </span>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                You've Hired {receiptData.freelancerName}!
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                The funds have been secured and the freelancing project is now in progress.
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
                <span className="text-slate-500 flex items-center gap-1 font-semibold">
                  <Receipt size={14} /> Transaction ID
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {receiptData.transactionId}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Activity Title</span>
                <span className="font-bold text-slate-800 truncate max-w-[200px]">
                  {receiptData.title}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Freelancer</span>
                <span className="font-bold text-slate-800">
                  {receiptData.freelancerName}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Payment Method</span>
                <span className="font-semibold text-slate-700">
                  {receiptData.paymentMethod}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-sm">
                <span className="font-bold text-slate-900">Total Paid</span>
                <span className="text-lg font-extrabold text-emerald-600">
                  ${receiptData.amount.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-emerald-700 transition"
            >
              Done & Return to Workspace
            </button>
          </div>
        ) : (
          /* PAYMENT FORM */
          <form onSubmit={handleSubmitPayment} className="mt-5 space-y-6">
            {/* Activity Summary Box */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    {activityDetails.category || "Freelance Activity"}
                  </span>
                  <h4 className="mt-1 font-bold text-slate-900 text-sm line-clamp-1">
                    {activityDetails.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <User size={13} className="text-slate-400" />
                    Freelancer: <span className="font-semibold text-slate-700">{activityDetails.freelancerName}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Budget / Amount</p>
                  <p className="text-lg font-extrabold text-emerald-600">
                    ${numericAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Payment Method Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Select Payment Method
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                    paymentMethod === "card"
                      ? "border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-500/20"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <CreditCard size={16} className={paymentMethod === "card" ? "text-emerald-600" : "text-slate-400"} />
                  Credit / Debit Card
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("paypal")}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                    paymentMethod === "paypal"
                      ? "border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-500/20"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Sparkles size={16} className={paymentMethod === "paypal" ? "text-emerald-600" : "text-slate-400"} />
                  PayPal / Instant Pay
                </button>
              </div>
            </div>

            {/* Card Inputs */}
            {paymentMethod === "card" ? (
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                    <Lock size={13} className="text-emerald-400" />
                    256-Bit Encrypted Card Payment
                  </span>
                  <div className="flex gap-1">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">VISA</span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">MC</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={cardForm.cardholderName}
                    onChange={(e) =>
                      setCardForm({ ...cardForm, cardholderName: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="4532 •••• •••• 8892"
                    value={cardForm.cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={cardForm.expiryDate}
                      onChange={handleExpiryChange}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="123"
                      value={cardForm.cvc}
                      onChange={(e) =>
                        setCardForm({ ...cardForm, cvc: e.target.value.replace(/\D/g, "") })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-emerald-50/50 p-5 text-center space-y-2">
                <Sparkles size={32} className="mx-auto text-emerald-600" />
                <p className="text-xs font-bold text-slate-800">
                  Instant PayPal Checkout Enabled
                </p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Clicking pay below will process your payment instantly via your connected PayPal balance.
                </p>
              </div>
            )}

            {/* Price Summary Breakdown */}
            <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Activity Fee ({activityDetails.title})</span>
                <span className="font-semibold text-slate-800">${numericAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service & Escrow Protection</span>
                <span className="font-semibold text-emerald-600">$0.00 (Waived)</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-sm text-slate-900">
                <span>Total Amount Due</span>
                <span className="text-emerald-600 text-base font-extrabold">
                  ${numericAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Security Guarantee Badge */}
            <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 p-2.5 text-[11px] text-slate-500">
              <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
              <span>Funds are protected by OpportunityX Escrow until delivery is completed.</span>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 rounded-2xl border border-slate-300 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-emerald-700 disabled:opacity-60 transition"
              >
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>Pay ${numericAmount.toFixed(2)} & Hire Student</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FreelancePaymentModal;
