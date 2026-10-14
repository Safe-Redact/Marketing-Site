# SafeRedact application capability audit

Date checked: 2026-10-13
Application source reviewed read-only: `M:\Safaridesk\redact` (`develop`)

This file is the marketing content source of truth for the current redesign. A capability may be described on the site only when the application repository contains both an implementation path and a user-facing workflow. Repository comments and disabled controls are not treated as shipped capabilities on their own.

## Verified product position

SafeRedact is a native Windows desktop application for redacting sensitive content in documents, still images, audio, and video. It combines automated detection or transcription with operator review and file export.

Evidence:

- Windows/WPF application target: `src/Presentation/Redactor.App/Redactor.App.csproj`
- Media domains and editor models: `src/Core/Redactor.Contracts/MediaDomain.cs` and `src/Presentation/Redactor.App/Features/Editor/EditorModels.cs`
- Document, image, audio, and video behavior overview: `README.md`

## Capabilities approved for marketing copy

| Capability | Application evidence | Marketing boundary |
| --- | --- | --- |
| Document intake | `src/Core/Redactor.Contracts/DocumentFileFormats.cs` accepts PDF, built-in convertible text/document formats, optional LibreOffice formats, common images, and PST/OST containers. | Say “PDF and supported converted documents.” Do not imply every conversion works without its optional local component. |
| Document review and redaction | `DocumentAssistantView.xaml`, `DocumentEditorView.xaml`, and `DocumentPageView.xaml.cs` expose detected findings, manual text/area selection, page scope, adjustment, and deletion. | Describe detection plus manual review; do not claim automatic completeness. |
| Still-image workflow | `EditorModels.cs` includes `MediaDomain.Image`; `ExportViewModel.cs` configures PNG image export. | Describe image review and PNG output without implying unavailable object categories. |
| Video detection and review | `DetectionTargets.cs` marks face, license plate, and text as implemented. `VideoAssistantView.xaml` and the editor expose effects, ranges, preview, and manual regions. | Name only faces, license plates, and text as implemented automated visual targets. |
| Audio transcription and redaction | `AudioAssistantView.xaml`, `AudioRedactionPipeline.cs`, and `AudioTranscriptionAdapterFactory.cs` implement transcription, sensitive-category analysis, time ranges, and audio effects. | Say local or configured transcription/detection; feature availability depends on installed models/tools and job configuration. |
| Review states and adjustment | `EditorModels.cs` contains pending/approved/rejected states; editor and document views expose approve, reject, adjust, add, and remove controls. | Present AI results as candidates that an operator reviews before export. |
| Export | `ExportViewModel.cs`, `DocumentExportView.xaml`, and application export composers implement media, image, audio, and document output paths. | Say “export” and advise checking the rendered result. Avoid guarantees or performance claims. |
| Local processing | README setup scripts plus the local ONNX, OCR, GLiNER, LLM, and whisper adapters implement on-device workflows. | Say “on-device processing after setup.” Do not imply that licensing or optional component setup is unnecessary. |
| Optional cloud processing | AWS adapters under `src/Infrastructure/Redactor.AI/Aws` and job configuration paths provide optional engines. | Say optional AWS-backed engines can be selected per job. Do not name integrations elsewhere unless needed. |
| Windows availability | WPF `net10.0-windows` application and Windows platform project. | State Windows desktop software. Do not claim macOS, Linux, browser, or mobile support. |

## Explicit exclusions

The marketing site must not present these as available product capabilities:

- Video detectors marked unavailable in `DetectionTargets.cs` and `VideoAssistantView.xaml`: screens, notepads, people, vehicles, barcodes, checks, credit cards, signatures, and logos.
- Editor commands that still return “not available yet,” including several copy/paste, layer-order, and tracked-region deletion actions in `EditorViewModel.cs` and `RegionContextMenuBuilder.cs`.
- Unimplemented settings sections in `SettingsView.xaml`.
- Guaranteed accuracy, guaranteed completeness, processing-time statistics, certifications, compliance guarantees, retention promises, confidentiality guarantees, or customer outcomes.
- Managed services. No verified production-ready managed-service offer was found in the reviewed desktop repository.

## Copy rule

When application behavior changes, update this audit first, cite the implementation and user-facing workflow, then revise marketing content and regression tests. If a capability is present only behind a disabled control, placeholder, mock view, TODO, or optional component that is not configured, describe the limitation or omit the claim.
