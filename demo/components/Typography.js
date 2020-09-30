import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../tailwind.config'

export default function Typography() {
  const fullConfig = resolveConfig(tailwindConfig)
  return (
    <>
      <div>
        {Object.keys(fullConfig.theme.capsize.fontMetrics).map((fontFamily, fontFamilyIndex) => (
          <div className={`font-${fontFamily} space-y-2 mb-12`} key={fontFamilyIndex}>
            <h2
              className={`font-bold font-${fontFamily} leading-none text-center text-gray-800 mb-8`}
              style={{ fontSize: '5rem' }}
            >
              font-{fontFamily}
            </h2>
            <div className="flex space-x-6">
              <div className="w-1/2">
                <h3 className={`text-5xl font-bold leading-none text-gray-800 mb-8`}>
                  font-size & line-height
                </h3>
                {Object.keys(fullConfig.theme.fontSize)
                  //   .reverse()
                  .map((fontSize, fontSizeIndex) => (
                    <div key={fontSizeIndex}>
                      <p
                        className={`text-${fontSize} break-all text-gray-900 bg-red-200 mb-6`}
                      >{`text-${fontSize}`}</p>
                      <p
                        className={`text-${fontSize} leading-none break-all text-gray-900 bg-red-200 mb-6`}
                      >{`text-${fontSize} leading-none`}</p>
                      <p
                        className={`text-${fontSize} leading-tight break-all text-gray-900 bg-red-200 mb-6`}
                      >{`text-${fontSize} leading-tight`}</p>
                      <p
                        className={`text-${fontSize} leading-relaxed break-all text-gray-900 bg-red-200 mb-6`}
                      >{`text-${fontSize} leading-relaxed`}</p>
                    </div>
                  ))}
              </div>
              <div className="w-1/2">
                <h3 className={`text-5xl font-bold leading-none text-gray-800 mb-8`}>
                  cap-height & line-gap
                </h3>
                <div className={`font-${fontFamily} space-y-2 mb-12`} key={fontFamilyIndex}>
                  {Object.keys(fullConfig.theme.capHeight)
                    .sort((a, b) => a - b)
                    .map((capHeight, capHeightIndex) => (
                      <div key={capHeightIndex}>
                        <p
                          className={`cap-height-${capHeight} break-all text-gray-900 bg-red-200 mb-6`}
                        >{`cap-height-${capHeight}`}</p>
                        <p
                          className={`cap-height-${capHeight} line-gap-0 break-all text-gray-900 bg-red-200 mb-6`}
                        >{`cap-height-${capHeight} line-gap-0`}</p>
                        <p
                          className={`cap-height-${capHeight} line-gap-8 break-all text-gray-900 bg-red-200 mb-6`}
                        >{`cap-height-${capHeight} line-gap-8`}</p>
                        <p
                          className={`cap-height-${capHeight} line-gap-10 break-all text-gray-900 bg-red-200 mb-6`}
                        >{`cap-height-${capHeight} line-gap-10`}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
