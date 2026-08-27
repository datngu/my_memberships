import { useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'
import { QRCodeSVG } from 'qrcode.react'
import type { CodeType } from '../types'

export function CodeDisplay({ code, codeType }: { code: string; codeType: CodeType }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (codeType === 'barcode' && svgRef.current) {
      try {
        JsBarcode(svgRef.current, code, {
          format: 'CODE128',
          width: 3,
          height: 120,
          displayValue: false,
          margin: 0,
        })
      } catch {
        // Falls back to showing the raw code text below the empty svg.
      }
    }
  }, [code, codeType])

  if (codeType === 'qr') {
    return <QRCodeSVG value={code} size={260} includeMargin />
  }

  return <svg ref={svgRef} />
}
