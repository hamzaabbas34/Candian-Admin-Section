import React from 'react';
import { AlertCircle, CheckCircle, Info, FileSpreadsheet, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ValidationGuideProps {
  invalidRows?: Array<{
    row: number;
    style: string;
    issues: string[];
  }>;
  missingImages?: string[];
  orphanImages?: string[];
}

const ValidationGuide: React.FC<ValidationGuideProps> = ({
  invalidRows = [],
  missingImages = [],
  orphanImages = []
}) => {
  const getFixInstructions = (issue: string) => {
    if (issue.includes('Missing Brand')) {
      return 'Add the Brand column with value: Azure, Monsini, or Risky';
    }
    if (issue.includes('Brand mismatch')) {
      return 'Change the Brand value to match your selected brand';
    }
    if (issue.includes('Missing Style')) {
      return 'Add a unique Style/product code (e.g., A00012)';
    }
    if (issue.includes('Duplicate Style')) {
      return 'Each Style must be unique - change or remove duplicates';
    }
    if (issue.includes('Missing Price')) {
      return 'Add a price value (numbers only, no $ symbol)';
    }
    if (issue.includes('Invalid Price')) {
      return 'Price must be a number greater than 0 (e.g., 299.99)';
    }
    if (issue.includes('Missing Size')) {
      return 'Add a size value (e.g., S, M, L, XL, or any text)';
    }
    if (issue.includes('No colors found')) {
      return 'Add at least one "Color 1" column with a color name';
    }
    return 'Please check the value and try again';
  };

  return (
    <div className="space-y-4">
      {/* Excel Errors with Solutions */}
      {invalidRows.length > 0 && (
        <div className="border-2 border-red-300 dark:border-red-700 rounded-lg overflow-hidden">
          <div className="bg-red-100 dark:bg-red-900/30 p-4 border-b-2 border-red-300 dark:border-red-700">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-red-600" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-700 dark:text-red-400">
                  Excel File Issues Found
                </h3>
                <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                  {invalidRows.length} {invalidRows.length === 1 ? 'row has' : 'rows have'} errors that need to be fixed
                </p>
              </div>
              <Badge variant="destructive" className="text-base px-3 py-1">
                {invalidRows.length} Error{invalidRows.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>

          <div className="p-4 space-y-3 max-h-96 overflow-y-auto bg-white dark:bg-gray-950">
            {invalidRows.map((row, i) => (
              <div key={i} className="border-2 border-red-200 dark:border-red-800 rounded-lg overflow-hidden">
                {/* Row Header */}
                <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 border-b border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-red-700 dark:text-red-400">
                        Excel Row {row.row}
                      </span>
                      <span className="text-sm text-red-600 dark:text-red-300 ml-2">
                        (Style: {row.style || 'Not specified'})
                      </span>
                    </div>
                    <Badge variant="outline" className="border-red-400 text-red-700">
                      {row.issues.length} issue{row.issues.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>

                {/* Issues and Solutions */}
                <div className="p-4 space-y-3">
                  {row.issues.map((issue, j) => (
                    <div key={j} className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-red-700 dark:text-red-400">
                          ❌ Problem: {issue}
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-400 mt-1 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span className="font-medium">
                            ✅ Solution: {getFixInstructions(issue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* How to Fix Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border-t-2 border-blue-300 dark:border-blue-700">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-semibold mb-2">📝 How to Fix These Errors:</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Open your Excel file</li>
                  <li>Navigate to the row numbers listed above</li>
                  <li>Apply the suggested solutions for each issue</li>
                  <li>Save the file and upload again</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Missing Images Guide */}
      {missingImages.length > 0 && (
        <div className="border-2 border-orange-300 dark:border-orange-700 rounded-lg overflow-hidden">
          <div className="bg-orange-100 dark:bg-orange-900/30 p-4 border-b-2 border-orange-300 dark:border-orange-700">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-orange-600" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-orange-700 dark:text-orange-400">
                  Missing Product Images
                </h3>
                <p className="text-sm text-orange-600 dark:text-orange-300 mt-1">
                  {missingImages.length} {missingImages.length === 1 ? 'product needs' : 'products need'} images to be uploaded
                </p>
              </div>
              <Badge className="bg-orange-600 text-base px-3 py-1">
                {missingImages.length} Missing
              </Badge>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-gray-950">
            <div className="mb-3">
              <p className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-2">
                🔍 Products Missing Images:
              </p>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded border border-orange-200 dark:border-orange-800 max-h-32 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {missingImages.map((style, i) => (
                    <Badge key={i} variant="outline" className="border-orange-400 text-orange-700">
                      {style}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

           
          </div>
        </div>
      )}

      {/* Orphan Images Info */}
      {orphanImages.length > 0 && (
        <div className="border-2 border-yellow-300 dark:border-yellow-700 rounded-lg overflow-hidden">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 border-b-2 border-yellow-300 dark:border-yellow-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
                  Unused Images Detected
                </h3>
                <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">
                  {orphanImages.length} {orphanImages.length === 1 ? 'image doesn\'t' : 'images don\'t'} match any product style (will be ignored)
                </p>
              </div>
              <Badge className="bg-yellow-600 text-base px-3 py-1">
                {orphanImages.length} Unused
              </Badge>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-gray-950">
            <div className="mb-3">
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                📁 Orphan Images (no matching Style):
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-800 max-h-32 overflow-y-auto">
                <div className="text-sm text-yellow-700 dark:text-yellow-400 font-mono">
                  {orphanImages.slice(0, 20).join(', ')}
                  {orphanImages.length > 20 && ` ... and ${orphanImages.length - 20} more`}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300 dark:border-blue-700">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  <p className="font-semibold mb-2">ℹ️ What This Means:</p>
                  <ul className="space-y-1">
                    <li>• These images don't match any Style in your Excel file</li>
                    <li>• They will be <span className="font-semibold">skipped</span> and not uploaded</li>
                    <li>• This is just a <span className="font-semibold">warning</span> - you can still proceed</li>
                    <li>• To use these images: Rename them to match a Style, or add corresponding products to Excel</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationGuide;

