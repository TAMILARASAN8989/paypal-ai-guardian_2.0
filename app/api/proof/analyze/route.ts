import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { documentName = 'Uploaded Receipt Sample', reportedAmount = '$1,250.00 USD' } = await req.json();

    const isTampered =
      documentName.toLowerCase().includes('forged') ||
      documentName.toLowerCase().includes('altered') ||
      reportedAmount.includes('12,500');

    const analysis = {
      id: `PRF-${Date.now().toString().slice(-4)}`,
      sampleName: documentName,
      documentType: 'Payment Proof Screenshot (Forensic Inspection)',
      reportedAmount,
      reportedTimestamp: `Analyzed at ${new Date().toUTCString().slice(17, 25)} UTC`,
      fontKerningScore: isTampered ? 34 : 96,
      recipientMatch: !isTampered,
      tamperScore: isTampered ? 88 : 6,
      verdict: isTampered ? ('MANIPULATED' as const) : ('AUTHENTIC' as const),
      detectedAnomalies: isTampered
        ? [
            'Font weight and kerning discrepancy detected around numeric values',
            'Quantization noise mismatch between background pixels and currency stamp',
            'Missing official cryptographic ledger signature seal',
          ]
        : [
            'Clean font baseline geometry across all currency rows',
            'Ledger hash verified against simulated sandbox database',
            'Timestamp aligns with recorded gateway event logs',
          ],
      digitalSignatureValid: !isTampered,
    };

    return NextResponse.json({ success: true, analysis });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Analysis failed' }, { status: 500 });
  }
}
