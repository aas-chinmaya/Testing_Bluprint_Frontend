



'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

import {
  Mail,
  Phone,
  User,
  MessageSquare,
  FileText,
  Loader2,
  PlusCircle,
  X,
} from 'lucide-react';

import { toast } from 'sonner';
import { addContact, getRecentContacts } from "@/modules/marketing/slices/contactSlice";

const countryOptions = [
  { label: 'UAE(+971)', value: '+971', digits: 9 },
  { label: 'IN(+91)', value: '+91', digits: 10 },
];

const ManualAddContactForm = ({ isOpen, onOpenChange }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+971',
    phone: '',
    inquirySource: '',
    message: '',
    internalNotes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  const currentCountry = countryOptions.find(c => c.value === formData.countryCode);
  const expectedDigits = currentCountry?.digits || 9;

  const validateName = (name) => /^[A-Za-z\s.'-]+$/.test(name.trim()) && name.trim().length >= 2;
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const validatePhone = (phone) => /^\d+$/.test(phone) && phone.length === expectedDigits;

  const sanitizeText = (text) => text.replace(/[<>&"';]/g, '').replace(/https?:\/\/[^\s]*/g, '');

  useEffect(() => {
    const newErrors = {};

    if (touched.fullName || formData.fullName) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      } else if (formData.fullName.trim().length < 2) {
        newErrors.fullName = 'Name must be at least 2 characters';
      } else if (!validateName(formData.fullName)) {
        newErrors.fullName = 'Only letters, spaces, hyphens, or apostrophes allowed';
      }
    }

    if (touched.email || formData.email) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    if (touched.phone || formData.phone) {
      if (!formData.phone.trim()) {
        newErrors.phone = 'Mobile number is required';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = `Exactly ${expectedDigits} digits required`;
      }
    }

    if (touched.inquirySource || formData.inquirySource) {
      if (!formData.inquirySource) {
        newErrors.inquirySource = 'Inquiry source is required';
      }
    }

    if (formData.message.length > 250) {
      newErrors.message = 'Message cannot exceed 250 characters';
    }

    if (formData.internalNotes.length > 250) {
      newErrors.internalNotes = 'Internal notes cannot exceed 250 characters';
    }

    setErrors(newErrors);
  }, [formData, touched, expectedDigits]);

  const isFormValid = () => {
    return (
      formData.fullName.trim() &&
      formData.email.trim() &&
      formData.phone.length === expectedDigits &&
      formData.inquirySource &&
      !Object.keys(errors).length
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitized = value;

    if (name === 'fullName') {
      sanitized = value.replace(/[^A-Za-z\s.'-]/g, '').slice(0, 50);
    } else if (name === 'email') {
      sanitized = value.slice(0, 80);
    } else if (name === 'phone') {
      sanitized = value.replace(/\D/g, '').slice(0, expectedDigits);
    } else if (name === 'message' || name === 'internalNotes') {
      sanitized = sanitizeText(value).slice(0, 250);
    }

    setFormData(prev => ({ ...prev, [name]: sanitized }));

    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleCountryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      countryCode: value,
      phone: '',
    }));
    setTouched(prev => ({ ...prev, phone: true }));
  };

  const handleInquirySourceChange = (value) => {
    setFormData(prev => ({ ...prev, inquirySource: value }));
    setTouched(prev => ({ ...prev, inquirySource: true }));
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      countryCode: '+971',
      phone: '',
      inquirySource: '',
      message: '',
      internalNotes: '',
    });
    setErrors({});
    setTouched({});
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      fullName: true,
      email: true,
      phone: true,
      inquirySource: true,
    });

    if (!isFormValid()) {
      return;
    }

    const submissionData = {
      ...formData,
      phone: `${formData.countryCode}${formData.phone}`,
    };

    setIsSubmitting(true);

    try {
      await dispatch(addContact(submissionData)).unwrap();

      toast.success('Contact added successfully!', {
        description: `${formData.fullName} has been saved.`,
        duration: 4000,
      });

      dispatch(getRecentContacts());
      handleClose();
    } catch (err) {
      toast.error('Failed to add contact', {
        description: 'Please try again later.',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-full max-w-[95vw] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl 
                   max-h-[92vh] flex flex-col bg-white rounded-xl p-0"
      >
        {/* Sticky Header */}
        <DialogHeader className="p-6 pb-4 border-b rounded-md  sticky top-0 bg-white z-10 flex-shrink-0">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Add New Contact
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-7 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-1">
              <Label htmlFor="fullName" className="flex items-center gap-1 font-medium text-gray-700">
                <User className="h-4 w-4 text-blue-600" />
                Contact Person <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter full name (max 50 chars)"
                maxLength={50}
                className="h-11"
                disabled={isSubmitting}
              />
              {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email" className="flex items-center gap-1 font-medium text-gray-700">
                <Mail className="h-4 w-4 text-blue-600" />
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter email address (max 80 chars)"
                maxLength={80}
                className="h-11"
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            {/* Mobile Number */}
            <div className="space-y-1">
              <Label className="flex items-center gap-1 font-medium text-gray-700">
                <Phone className="h-4 w-4 text-blue-600" />
                Mobile Number <span className="text-red-500">*</span>
              </Label>
              <div className="flex w-full">
                <select
                  value={formData.countryCode}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  disabled={isSubmitting}
                  className="h-11 w-32 rounded-l-md border border-gray-500 bg-white px-3 text-sm disabled:bg-gray-100"
                >
                  {countryOptions.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter mobile number"
                  maxLength={expectedDigits}
                  disabled={isSubmitting}
                  className="h-11 flex-1 rounded-r-md border border-l-0 border-gray-300 px-4 text-sm placeholder-gray-400 disabled:bg-gray-100"
                />
              </div>
              {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
            </div>

            {/* Inquiry Source */}
            <div className="space-y-1">
              <Label htmlFor="inquirySource" className="flex items-center gap-1 font-medium text-gray-700">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                Inquiry Source <span className="text-red-500">*</span>
              </Label>
              <select
                id="inquirySource"
                value={formData.inquirySource}
                onChange={(e) => handleInquirySourceChange(e.target.value)}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className="h-11 w-full rounded-md border border-gray-500 bg-white px-3 text-sm disabled:bg-gray-100"
              >
                <option value="" disabled>Select source</option>
                {['Social Media', 'Event', 'Referral', 'Marketing Team', 'Other'].map((src) => (
                  <option key={src} value={src}>{src}</option>
                ))}
              </select>
              {errors.inquirySource && <p className="text-sm text-red-600 mt-1">{errors.inquirySource}</p>}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-1">
            <Label htmlFor="message" className="flex items-center justify-between font-medium text-gray-700">
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                Message
              </span>
              <span className="text-sm text-gray-500">{formData.message.length}/250</span>
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter inquiry message (optional)"
              rows={4}
              className="resize-y min-h-24"
              disabled={isSubmitting}
            />
            {errors.message && <p className="text-sm text-red-600 mt-1">{errors.message}</p>}
          </div>

          {/* Internal Notes */}
          <div className="space-y-1">
            <Label htmlFor="internalNotes" className="flex items-center justify-between font-medium text-gray-700">
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4 text-blue-600" />
                Internal Notes
              </span>
              <span className="text-sm text-gray-500">{formData.internalNotes.length}/250</span>
            </Label>
            <Textarea
              id="internalNotes"
              name="internalNotes"
              value={formData.internalNotes}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Add internal notes (optional)"
              rows={4}
              className="resize-y min-h-24"
              disabled={isSubmitting}
            />
            {errors.internalNotes && <p className="text-sm text-red-600 mt-1">{errors.internalNotes}</p>}
          </div>

          {/* Footer Buttons - fixed at bottom */}
          <div className="flex justify-end gap-4 pt-6 border-t flex-shrink-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting} size="lg">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              size="lg"
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 shadow-lg disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Contact
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManualAddContactForm;