import React, { useState } from 'react';
import { Award, Check, Copy, ExternalLink, GraduationCap, Printer, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useLearner } from '@/context/LearnerContext';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';
import type { CertificateRecord } from '@/types';

export const CertificationsPage: React.FC = () => {
  const { t, pickText } = useI18n();
  const { user, certificates } = useLearner();
  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (cert: CertificateRecord) => {
    navigator.clipboard?.writeText(`https://academy.camcodelearn.edu/verify/${cert.credentialCode}`);
    setCopiedId(cert.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#0F172A] tracking-tight">
            {t.nav.certifications}
          </h1>
          <p className="text-[14.5px] text-[#475569] mt-1">
            Verified credentials earned by completing CamcodeLearn Academy courses and exams.
          </p>
        </div>
        <Link to="/assessments">
          <Button variant="outline" size="sm">
            Take Certification Exam
          </Button>
        </Link>
      </div>

      {certificates.length === 0 ? (
        <div className="glass-card rounded-[18px] p-10 text-center space-y-3">
          <Award className="h-10 w-10 text-[#94A3B8] mx-auto" />
          <h3 className="text-[18px] font-bold text-[#0F172A]">No certificates earned yet</h3>
          <p className="text-[14px] text-[#64748B]">
            Complete a course or pass a certification exam to earn your first verified credential.
          </p>
          <Link to="/assessments" className="inline-block">
            <Button>Explore Assessments</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => {
            const category = catalogService.getCategoryBySlug(cert.categorySlug);
            return (
              <div
                key={cert.id}
                className="glass-card rounded-[18px] overflow-hidden flex flex-col"
              >
                {/* Certificate Ribbon Banner */}
                <div className="p-5 bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] text-white flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified Academy Credential
                    </span>
                    <h2 className="text-[18px] font-bold leading-snug">{pickText(cert.title)}</h2>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                    <Award className="h-6 w-6 text-amber-300" />
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-3 text-[13px]">
                    <div>
                      <p className="text-[#64748B] text-[11.5px]">Recipient</p>
                      <p className="font-semibold text-[#0F172A]">{user.fullName}</p>
                    </div>
                    <div>
                      <p className="text-[#64748B] text-[11.5px]">Issued Date</p>
                      <p className="font-semibold text-[#0F172A]">{cert.issuedAt}</p>
                    </div>
                    <div>
                      <p className="text-[#64748B] text-[11.5px]">Credential ID</p>
                      <p className="font-mono-custom font-semibold text-[#2563EB]">
                        {cert.credentialCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#64748B] text-[11.5px]">Category</p>
                      <p className="font-semibold text-[#0F172A]">
                        {category ? pickText(category.name) : 'Academy'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E2E8F0] dark:border-slate-800 flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedCert(cert)}
                      leftIcon={<ExternalLink className="h-3.5 w-3.5" />}
                    >
                      View & Print
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(cert)}
                      leftIcon={
                        copiedId === cert.id ? (
                          <Check className="h-3.5 w-3.5 text-[#16A34A]" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )
                      }
                    >
                      {copiedId === cert.id ? 'Link Copied' : 'Share Link'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Certificate Preview Modal */}
      <Modal
        open={Boolean(selectedCert)}
        onClose={() => setSelectedCert(null)}
        title="Official Academy Certificate"
        maxWidthClass="max-w-3xl"
      >
        {selectedCert && (
          <div className="space-y-5">
            <div className="rounded-[16px] border-4 border-double border-[#2563EB]/40 bg-gradient-to-br from-white via-[#F8FAFC] to-[#EFF6FF] dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-7 sm:p-10 text-center space-y-5">
              <div className="flex items-center justify-center gap-2 text-[#2563EB] font-bold text-[14px] uppercase tracking-widest">
                <GraduationCap className="h-5 w-5" />
                <span>CamcodeLearn Academy</span>
              </div>

              <div className="space-y-1">
                <p className="text-[12px] uppercase tracking-widest text-[#64748B]">
                  Certificate of Completion
                </p>
                <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#0F172A]">
                  {user.fullName}
                </h2>
              </div>

              <p className="text-[14px] text-[#475569] max-w-lg mx-auto">
                has successfully fulfilled all curriculum and assessment requirements for
              </p>

              <h3 className="text-[20px] sm:text-[22px] font-bold text-[#2563EB]">
                {pickText(selectedCert.title)}
              </h3>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Badge tone="success">Issued {selectedCert.issuedAt}</Badge>
                <Badge tone="neutral">{selectedCert.hoursCompleted} Learning Hours</Badge>
                {selectedCert.score && <Badge tone="primary">Exam Score: {selectedCert.score}%</Badge>}
              </div>

              <div className="pt-6 border-t border-[#E2E8F0] dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#64748B]">
                <div>
                  <p className="font-semibold text-[#0F172A]">{selectedCert.instructorName}</p>
                  <p>Lead Instructor / Assessment Board</p>
                </div>
                <div className="text-center sm:text-right">
                  <p className="font-mono-custom font-semibold text-[#0F172A]">
                    {selectedCert.credentialCode}
                  </p>
                  <p>Verified Credential ID</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 no-print">
              <Button variant="outline" onClick={() => setSelectedCert(null)}>
                {t.common.close}
              </Button>
              <Button onClick={() => window.print()} leftIcon={<Printer className="h-4 w-4" />}>
                Print / Save PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

