# OpenRedakt Pricing Feature Audit

Audit date: 28 October 2026

This audit is the evidence base for the package feature lists on `/pricing`. Every advertised
capability was traced to the desktop application's services, UI entry points and tests, not to
README text, enum names or marketing copy. The public page summarises these rows in plain-language
bullets and a short comparison held in `src/content/pricing.ts`; this document keeps the full,
row-by-row coverage.

## Repositories inspected (read-only)

| Repository | Branch | HEAD | Notes |
| --- | --- | --- | --- |
| `M:\Safaridesk\redact` (desktop) | `develop` | `be61394` | Working tree already had unrelated uncommitted `.csproj`/`Directory.Build.props` edits. Nothing was changed. |
| `M:\Safaridesk\Admin-panel` (Control Center) | `feat/desktop-download-ui` | `9bc263b` | Clean. Nothing was changed. |

Paths below are relative to `M:\Safaridesk\redact\src` unless prefixed with `tests/` (relative to
the desktop repository root) or `Admin-panel/`.

## Status key

| Status | Meaning |
| --- | --- |
| Operational | UI entry point, working service, and automated tests found. |
| Operational (dependency) | Works, but needs a component the installer does not always provide. The dependency is stated wherever the feature is advertised. |
| Partial | Implemented, but behaviour is limited or conditional in a way that makes a general claim inaccurate. |
| Experimental / held back | Implemented in code, but quality, scope or commercial approval is unverified. Not advertised. |
| Unsupported | No working implementation, or only a label/enum. Not advertised. |

## Document capabilities (Essential, Complete Suite)

| Capability | Status | Implementation evidence | Limitations | Advertise |
| --- | --- | --- | --- | --- |
| PDF import (native) | Operational | `Core/Redactor.Contracts/DocumentFileFormats.cs` (`NativeExtension`); `Infrastructure/Redactor.Document/IronPdfDocumentEngine.cs` | — | Yes |
| Word `.docx`, RTF, HTML, Markdown, plain-text import | Operational | `DocumentFileFormats.BuiltInConvertibleExtensions`; `IronPdfDocumentSourceConverter.cs:38-91`; `tests/Redactor.Document.Tests/DocumentSourceConversionTests.cs` | Converted to PDF at import. | Yes |
| Legacy Word, Excel, PowerPoint, OpenDocument, CSV import | Operational (dependency) | `SofficeDocumentSourceConverter.cs` (headless LibreOffice); App log line in `App.xaml.cs` | Requires LibreOffice installed on the computer. The installer does not bundle it (`installer/` has no LibreOffice reference). | Yes, with the restriction stated in the comparison table |
| Password-protected PDF import | Operational | `Features/Document/PasswordPromptWindow.xaml`; `DocumentPreparationOptions.SourcePassword` (never persisted); `tests/Redactor.Document.Tests/PasswordProtectedSourceTests.cs` | Password is requested again on reopen by design. | Yes |
| OCR for scanned / image-only pages | Operational | `IronOcrDocumentOcr.cs`; `Features/Document/DocumentOcrView.xaml`; `DocumentOcrLanguages` (English, French, German, Spanish, Italian, Portuguese, Dutch, Arabic, Chinese Simplified); `IronOcrDocumentOcrTests.cs`, `HostedOcrTests.cs` | Nine recognition languages. | Yes |
| On-device sensitive-information detection | Operational (dependency) | `App.xaml.cs:445-560` builds `CompositeDocumentDetector` from `RegexDocumentDetector` + `GlinerDocumentDetector`; categories in `DocumentFindingCategory`; `GlinerDocumentDetectorTests.cs`, `DetectionRecallTests.cs`, `RegexDocumentDetectorTests.cs` | The PII model ships in the Full installer or is downloaded after a Lite install. Without it only exact formats (cards, phones, emails, IDs) are found, and the assistant says so. | Yes |
| Custom regex patterns and saved pattern library | Operational | `DocumentPatternLibraryStore.cs`; `Features/Document/RegexTemplateLibraryWindow.xaml`; `AnalyzeDocumentRequest.CustomPatterns`; `DocumentPatternLibraryStoreTests.cs` | — | Yes |
| Word lists and never-redact block list | Operational | `AnalyzeDocumentRequest.Terms` / `BlockedTerms`; assistant "Block list"; "Load word list (.txt)" | — | Yes |
| Find & Redact search (text, regex, term list) | Operational | `DocumentTextSearch.cs`; `DocumentSearchMode`; `RedactDocumentMatchesRequest`; `DocumentTextSearchTests.cs` | Case-insensitive by design. | Yes |
| Detection across a page range or selected project documents | Operational | `DocumentAssistantView.xaml` ("Run on the current document, a page range, or only the project files you choose") | — | Yes |
| Text and area redaction | Operational | `DocumentRedactionSelection` (`Text`, `Area`); `ManualMarkExportTests.cs`, `DocumentCharacterSelectionTests.cs` | — | Yes |
| Editable findings before export | Operational | Desktop uses `DocumentResultPolicy.AutoApprove`: findings become editable marks; assistant copy "You can adjust or delete any mark before export" | Findings are applied as marks immediately, not held in a separate approval queue. Copy says "review, adjust or remove". | Yes |
| Redaction appearances | Operational | `DocumentRedactionAppearance` (Blackout, Whiteout, ReplacementLabel, CustomColour); `RedactionStampTests.cs` | — | Yes |
| Redaction reasons / exemption library | Operational | `RedactionReasonLibraryStore.cs`; `Features/Document/RedactionReasonLibraryWindow.xaml`; `ExportDocumentRequest.StampReasonCodes`; `DocumentRedactionReasonTests.cs`, `ReasonIdExportTests.cs` | — | Yes |
| Reusable redaction templates | Operational | `DocumentRedactionTemplates.cs`; `DocumentWorkflowService.Templates.cs`; `DocumentTemplatesPanel.xaml`; `DocumentRedactionTemplateTests.cs` | Intended for documents with the same layout. | Yes |
| Repeat a mark across pages | Operational | `DocumentRepeatRedactionResult`; `DocumentRepeatRedactionTests.cs` | Skipped pages are reported. | Yes |
| Undo history and named checkpoints | Operational | `DocumentEditorViewModel.History.cs`; `DocumentWorkflowService.Checkpoints.cs`; `Features/Workflow/CheckpointHistoryDialog.xaml`; `DocumentCheckpointTests.cs` | — | Yes |
| Merge, split, extract and delete pages | Operational | `Features/Document/DocumentPageToolsView.xaml`; `PdfPageToolTests.cs` | Writes new PDFs; source left untouched. | Yes |
| Permanent redaction | Operational | `IronPdfDocumentEngine.cs`; `ResistantPdfRedactionTests.cs`; export copy "The output is rebuilt, so marked text cannot be recovered" | Pages that resist redaction are rebuilt as images and reported (`DocumentExportResult.RasterisedPages`). | Yes |
| Independent output verification | Operational | `PdfPigOutputVerifier.cs`, `OcrDocumentResidualValidator.cs`, `RedactionCoverageValidator.cs`; export copy "If any redacted text could still be read, the file is refused"; `RedactionCoverageValidatorTests.cs`, `OcrDocumentResidualValidatorTests.cs` | Document exports only. | Yes |
| Metadata and hidden-content removal | Operational | `IronPdfDocumentEngine.ApplyMetadata` (`:1558-1590`); `PdfRemovedContent` (comments, form fields, attachments, outlines) | — | Yes |
| PDF, PDF/A and TIFF Group IV export | Operational | `DocumentExportFormat`; `DocumentEditorViewModel.ExportFormats` (`:3566-3570`); `DeliverableStructureTests.cs` | PDF/A and TIFF cannot be password protected. | Yes |
| Password-protected PDF export | Operational | `ExportDocumentRequest.EncryptWithPassword`; `Validate()` | Standard PDF only. | Yes |
| Bates numbering, page numbers, date stamps | Operational | `PdfStampOptions`; `ExportDocumentRequest.BatesNumbering/PageNumbering/DateStamp`; `PageStampTests.cs`, `PdfStampOptionsTests.cs` | — | Yes |
| Watermarks (text or image) | Operational | `DocumentWatermarkOptions`; `WatermarkTilingTests.cs` | — | Yes |
| Redaction report (PDF + CSV) and optional JSON audit report | Operational | `Domains/Redactor.Domain.Document.Reporting/DocumentRedactionReportAdapter.cs`; `JsonDocumentAuditReporter.cs`; registered for `MediaDomain.Document` only (`App.xaml.cs` report registry); `RedactionReportExportTests.cs`, `JsonDocumentAuditReporterTests.cs` | Documents only. Never quotes redacted text. | Yes |
| Export several documents at once | Operational | `DocumentExportView.xaml` "Export all" (every checked document, each into its own folder) | — | Yes |
| Outlook `.pst` / `.ost` mailbox import | Experimental / held back | `XstMailboxExpander.cs`, wired at `App.xaml.cs:1032`; `XstMailboxExpanderTests.cs` | Combines messages into one PDF; attachment handling is not documented for customers; single `.eml`/`.msg` files are **not** accepted (`FileTypeBadge` recognises them, `DocumentFileFormats.InputExtensions` does not). Advertising it risks implying general email redaction. | No — needs product sign-off |
| Individual email files (`.eml`, `.msg`) | Unsupported | Badge only (`Features/Workspace/FileTypeBadge.cs:49`) | — | No |
| Cloud document analysis (AWS Textract via OpenRedakt Cloud gateway) | Experimental / held back | `CloudDocumentAnalysisAdapter` (`App.xaml.cs:589`); Control Center enforces `Entitlements.Document` (`Admin-panel/.../Cloud.cs:158`) | Cloud quotas are separate policy records; no cloud allowance is approved for any package. | No |
| "Deep" detection with the Local Assistant Model | Partial | `LanguageModelDocumentDetector` (`App.xaml.cs:494-510`) | Optional ~4.7 GB download; best with a GPU. | No |
| Standalone image redaction | Not marketed | Images open in a document project as one-page PDFs for OCR (`DocumentFileFormats.ImageExtensions`) | Internal document-workflow behaviour only. | No |

## Audio capabilities (Advanced, Complete Suite)

| Capability | Status | Implementation evidence | Limitations | Advertise |
| --- | --- | --- | --- | --- |
| Audio import | Operational (dependency) | `MediaFileFormats.AudioInputExtensions` (WAV, MP3, M4A, AAC, FLAC, OGG, OGA, Opus, WMA, AIFF, ALAC, AMR); `AudioCapabilityRegistry` `audio.import`; `MediaImportCoordinatorTests.cs` | Uses the pinned ffmpeg build (in the Full installer, or the optional Media Processing Tools download; `setup/Get-FfmpegTools.ps1`, `installer/MediaToolsGuard.iss`). | Yes |
| On-device transcription | Operational (dependency) | `Infrastructure/Redactor.AI/Audio/WhisperCppTranscriptionAdapter.cs`; called from `MainWindowViewModel.cs:3929, 11483`; `WhisperCppTranscriptionAdapterTests.cs`, `ReopenedJobTranscriptionTests.cs` | whisper.cpp is installed with the Full edition or downloaded later. | Yes |
| Sensitive-speech detection (names, addresses, phones, emails, ID numbers, financial details, credentials) | Operational (dependency) | `AudioRedactionPipeline.DetectSensitiveContentAsync` called from `MainWindowViewModel.cs:11285, 11539`; `CombinedAudioSensitiveContentDetector`; `TasmanianDevilAudioPiiDetectionEngine`; `CombinedAudioSensitiveContentDetectorTests.cs`, `AudioRedactionPipelineTests.cs`, `TasmanianDevilAudioPiiDetectionEngineTests.cs` | Names and addresses need the Offline PII model; phone, email, financial and identifier rules need no model. `docs/audio-ai-pipeline-status.md` in the desktop repo says the assistant is "not wired"; that note predates the current code, which runs transcription and detection end to end. | Yes |
| Contextual medical / legal / narrative detection | Experimental / held back | Keyword heuristics in `AudioRedactionPipeline.cs:837-844, 1764-1766` | Heuristic matching with low confidence weights; precision unverified. | No |
| Process several recordings in one assistant run | Operational | `AudioAssistantViewModel` "All audios" scope; loop over targets in `MainWindowViewModel.cs:11440-11560` | Cloud detection is not used for batch runs. | Yes |
| Finding review (approve / reject) | Operational | `Features/Editor/FindingReviewDecisions.cs`; `FindingReviewDecisionsTests.cs`, `FindingReviewPersistenceTests.cs` | — | Yes |
| Transcript-based redaction | Operational | `TranscriptRedactionProjector.cs`, `TranscriptWordPadding.cs`; `TranscriptSelectionMenuTests.cs`, `TranscriptRedactionTimingTests.cs`, `TranscriptRedactionMarginTests.cs`, `TranscriptRedactionSafetyTests.cs` | Word timings padded; segments without word timings redact the whole segment (safety-first). | Yes |
| Playback-synchronised transcript | Operational | `TranscriptPlaybackFollowState.cs`, `TranscriptPlaybackProgressCalculator.cs`; `TranscriptPlaybackFollowTests.cs`, `TranscriptPlaybackHighlightTests.cs`, `EditorPlaybackSyncTests.cs` | — | Yes |
| Waveform timeline and manual range redaction | Operational | `FfmpegAudioWaveformService.cs`; `EditorTimelineView.xaml`; `AudioWaveformServiceTests.cs`, `TimelineRedactionIntegrityTests.cs`, `TimelinePointerTests.cs` | — | Yes |
| Effect preview during playback, adjustable speed | Operational | `RedactionPreviewSampleProvider.cs`, `SoundTouchPlaybackRateSampleProvider.cs`; `AudioEffectPlaybackTests.cs`, `RedactionPreviewSampleProviderTests.cs` | — | Yes |
| Undo | Operational | `AudioRedactionUndoTests.cs` | — | Yes |
| Mute, silence, beep, tone | Operational | `AudioEffect` enum; `AudioEffectComposition.cs`; `FfmpegAudioRangeRenderer.cs`; `AudioEffectExportTests.cs`, `MainWindowViewModelTests.RealTranscriptMute.cs` | — | Yes |
| White / pink noise, low-pass, high-pass, reverse | Operational | Same as above; assistant "Effects" step | — | Yes |
| Voice disguise | Operational | `FfmpegVoiceDisguiseRenderer.cs`, `VoiceDisguiseChain.cs`; Editor "Voice disguise" button (`EditorView.xaml:1311`); `VoiceDisguiseTests.cs`, `MainWindowViewModelTests.RealDisguiseExport.cs` | Requires ffmpeg with rubberband; the pinned build is verified for it (`Get-FfmpegTools.ps1:69-71`). Changes how a voice sounds but keeps the words. | Yes |
| Redacted audio export | Operational | `Features/Export/Runners/AudioExportRunner.cs`; `MediaFileFormats.AudioExportExtensions` (WAV, MP3, M4A, AAC, FLAC, OGG, Opus); `MainWindowViewModelTests.RealAudioExport.cs` | Writes a new file; original untouched. No independent post-export verification pass exists for audio, so "verified" is not claimed. | Yes |
| Redacted transcript export | Operational | `TranscriptExportService.cs` (TXT, SRT, VTT, DOCX, PDF; redactions written as `[REDACTED]`); `TranscriptExportTests.cs` | — | Yes |
| Speaker identification | Partial | whisper.cpp `-di` (`WhisperCppTranscriptionAdapter.cs:238`) is stereo-channel separation only; cloud diarization depends on the managed cloud | Not general speaker recognition. | No |
| Transcript translation | Experimental / held back | `LocalLlmTranscriptTranslationService`, `CloudTranslateTranscriptTranslationService`; `OfflineTranslationTests.cs` | Local route needs the optional ~4.7 GB model; cloud route needs both entitlements and an unapproved cloud quota; translation quality unverified. | No |
| Cloud transcription / detection | Experimental / held back | `CloudTranscriptionAdapter`, `CloudAudioDetectionAdapter`; Control Center `Entitlements.Audio` checks | No approved cloud allowance. | No |
| Audio redaction report / audit trail | Unsupported for audio-only | `StandardReportDownload.cs` returns "Open a video to download its Standard Report"; report registry only registers `MediaDomain.Document` | — | No |
| Bulk Process window | Not applicable | `Features/Batch/BulkProcessingView.xaml` targets "every ticked video" | Video-only UI. | No |

## Platform and licensing (all packages)

| Capability | Status | Evidence | Limitations | Advertise |
| --- | --- | --- | --- | --- |
| Windows desktop application | Operational | .NET 10 WPF (`Presentation/Redactor.App`); Inno Setup installer (`installer/SafeRedact.iss`) | Windows 10/11. | Yes |
| On-device processing | Operational | Detection, redaction and export run locally (`README.md`, local engines wired in `App.xaml.cs`); cloud routes are opt-in and not advertised | Signing in to the app needs an internet connection (`App.xaml.cs` `DesktopSessionHost`, issue #148). | Yes, with the sign-in restriction |
| Named-user license assigned by email | Operational | `Admin-panel/src/SafeRedact.ControlCenter.Domain/Licensing.cs:62-85`; `LicensingService.cs:141-169` | — | Yes |
| Owner/Admin license management in the Control Center | Operational | `TenantRole` (`Tenancy.cs:14`); `Organisation.razor:313-472` | — | Yes |
| Signed, device-bound activation | Operational | `LicenseGate.cs:88-187`; `LicenseValidator.cs`; fingerprint in token | — | Yes |
| View and release activated computers | Operational | `Organisation.razor:544-575`; `LicensingService.cs:337-363` | A different replacement computer waits 24 hours. Air-gapped keys cannot be released by the customer. | Yes |
| One active desktop sign-in per named user | Operational | `DesktopSessionHost` ("a sign-in on another computer puts the sign-in screen in front"); `Admin-panel` `DesktopSessionTests.cs:48-75` | — | Yes (as a restriction) |
| Device allowance | Configurable, not approved | `Plan.MaxDevicesPerSeat` default 2 (`Licensing.cs:36`) | No approved number for the new packages. | Only as "confirmed in your quote" |
| One-year term, billed annually | Commercial | `LicenceTerm.cs` supports one-year terms; billing cadence is a sales decision | Control Center does not take payment. | Yes |
| Local Document-vs-Audio enforcement | Not implemented | No desktop call to `Allows(Entitlements.Document/Audio)`; only `LicenseGate.cs:54` mentions `Allows(Entitlements.Video)` in a comment | Cloud endpoints do enforce (`Admin-panel/.../Cloud.cs:153-164`). Launch blocker tracked in `docs/openredakt-control-center-licensing-audit.md`. | No (internal) |
| Collaboration, shared cloud storage, quotas, SLAs, account management, integrations, unlimited usage | Unsupported / unapproved | No implementation or commercial approval found | — | No |

## Feature-to-package matrix (advertised rows only)

Essential and Advanced are separate capability families. Complete Suite is the union. No feature is
listed under a package whose family does not contain it.

This is internal coverage. The public cards and comparison summarise it (see "Public presentation").

| Category | Feature (customer-facing) | Essential | Advanced | Complete Suite |
| --- | --- | --- | --- | --- |
| Document import & OCR | PDF, Word, RTF, HTML and text files | ✓ | — | ✓ |
| | Excel, PowerPoint and legacy Office files (LibreOffice required) | ✓ | — | ✓ |
| | Password-protected PDF import | ✓ | — | ✓ |
| | OCR for scanned pages (nine languages) | ✓ | — | ✓ |
| | Merge, split, extract and delete pages | ✓ | — | ✓ |
| AI-assisted detection | On-device AI detection of personal data | ✓ | — | ✓ |
| | Find & Redact by text, pattern or word list | ✓ | — | ✓ |
| | Custom patterns and a saved pattern library | ✓ | — | ✓ |
| | Word lists and a never-redact block list | ✓ | — | ✓ |
| | Run on a page range or selected documents | ✓ | — | ✓ |
| Review & editing | Text and area redaction | ✓ | — | ✓ |
| | Review, adjust or remove every mark | ✓ | — | ✓ |
| | Redaction reasons and exemption codes | ✓ | — | ✓ |
| | Reusable redaction templates (and repeat a mark across pages) | ✓ | — | ✓ |
| | Black, white, colored or labeled boxes | ✓ | — | ✓ |
| | Undo history and named checkpoints | ✓ | — | ✓ |
| Export & verification | Permanent redaction | ✓ | — | ✓ |
| | Independent output verification | ✓ | — | ✓ |
| | Metadata and hidden-content removal | ✓ | — | ✓ |
| | PDF, PDF/A and TIFF Group IV export | ✓ | — | ✓ |
| | Bates numbering, stamps and watermarks (and password-protected PDF) | ✓ | — | ✓ |
| | Redaction report as PDF and CSV | ✓ | — | ✓ |
| | Export several documents at once | ✓ | — | ✓ |
| Transcription & detection | Import WAV, MP3, M4A, FLAC and more (12 formats) | — | ✓ | ✓ |
| | On-device speech-to-text | — | ✓ | ✓ |
| | AI detection of sensitive speech | — | ✓ | ✓ |
| | Process several recordings in one run | — | ✓ | ✓ |
| Review & editing | Approve or reject each finding | — | ✓ | ✓ |
| | Redact directly from the transcript | — | ✓ | ✓ |
| | Transcript synchronized with playback | — | ✓ | ✓ |
| | Waveform timeline with manual ranges | — | ✓ | ✓ |
| | Preview effects before export, with undo | — | ✓ | ✓ |
| Redaction effects | Mute, silence, beep or tone | — | ✓ | ✓ |
| | Noise masking and frequency filters | — | ✓ | ✓ |
| | Voice disguise | — | ✓ | ✓ |
| Export | Redacted audio in seven formats | — | ✓ | ✓ |
| | Redacted transcript export (TXT, SRT, VTT, DOCX, PDF) | — | ✓ | ✓ |
| Licensing (all packages) | Named-user license; owner/admin management in the Control Center; signed, device-bound activation on Windows; view and release activated computers | ✓ | ✓ | ✓ |

## Public presentation

The pricing page shows six to seven benefit bullets per card and a 12-row comparison. Each bullet
groups advertised rows above; nothing on the page goes beyond them.

| Public bullet or row | Audit rows it summarises |
| --- | --- |
| Redact PDFs, Word files and other common document formats | PDF import; Word/RTF/HTML/text import (LibreOffice-dependent formats are only named in the FAQ) |
| OCR that makes scanned and image-only pages redactable | OCR for scanned / image-only pages |
| On-device AI detection of names, IDs, financial data and more | On-device sensitive-information detection |
| Text, area, search and pattern-based redaction | Text and area redaction; Find & Redact; custom patterns; word lists |
| Review every mark, with redaction reasons, templates and undo | Editable findings; reasons library; templates; undo and checkpoints |
| Permanent redaction, independently verified, with metadata removed | Permanent redaction; independent output verification; metadata removal (documents only) |
| PDF, PDF/A and TIFF export with Bates numbering and redaction reports | Export formats; Bates/stamps; redaction report |
| Redact WAV, MP3, M4A, FLAC and other common audio formats | Audio import |
| On-device speech-to-text with word-level timing | On-device transcription |
| AI detection of spoken names, numbers and personal details | Sensitive-speech detection (core categories only) |
| Redact directly from a transcript synchronized with playback | Transcript-based redaction; playback-synchronised transcript |
| Waveform timeline to review and adjust every redaction | Waveform timeline; finding review; preview and undo |
| Mute, beep, tone, noise masking or voice disguise | Audio effects; voice disguise |
| Export redacted audio and redacted transcripts | Redacted audio export; redacted transcript export (no audio verification or report is claimed) |
| Complete Suite bullets | The union of the two families, plus "one named-user license covers both workflows" |
| Shared license note under the cards | Named-user license by email; Owner/Admin management; signed, device-bound activation |
| Comparison rows | Five document rows, five audio rows, two package-neutral rows (Windows/on-device processing; Control Center licensing). Document verification and reports appear only on document rows. |
| FAQ: file formats and technical requirements | Full input/output format lists; LibreOffice dependency; Windows 10/11; internet sign-in; one active desktop session |

## Validation (28 October 2026, simplification pass)

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass, no warnings |
| `npm run build` (isolated same-drive copy; the dev server was running) | Pass. One standalone-trace symlink warning caused by the copy's junctioned `node_modules`. |
| `npm run test:static` | 44/44 |
| `npm run test:content` (includes `tests/pricing-features.test.ts`) | 125/125 |
| `npm run test:routes` against the production build (includes `tests/pricing-product-scope.test.mjs`) | 37/37 |
| `npm run check:secrets` | Pass |
| `git diff --check` and whitespace check of new files | Clean |
| Browser: 1440, 768, 390, 360 px | No horizontal overflow or clipped table cells; cards 992 px tall with aligned prices and CTAs at desktop, about 900 px each on phones |
| Enquiry CTA | `?package=essential#demo-enquiry` preselects OpenRedakt Essential; license quantity accepts 12. The form was not submitted. |

Page height fell from 11,506 px to 6,946 px at 1440 px wide, and from 17,739 px to 11,735 px at 390 px.

Screenshots: `docs/openredakt-pricing-acceptance-screenshots/pricing-cards-desktop-1440.png`,
`pricing-full-desktop-1440.png`, `pricing-full-tablet-768.png`, `pricing-cards-mobile-390.png`,
`pricing-full-mobile-390.png`.
