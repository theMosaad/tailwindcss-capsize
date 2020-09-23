import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../tailwind.config'

export default function CapHeight() {
  const fullConfig = resolveConfig(tailwindConfig)
  return (
    <section>
      {Object.keys(fullConfig.theme.capsize.fontMetrics).map((fontFamily, fontFamilyIndex) => (
        <div className={`font-${fontFamily} space-y-2 mb-12`} key={fontFamilyIndex}>
          <h2
            className={`font-bold font-${fontFamily} leading-none text-gray-800`}
            style={{ fontSize: '5rem' }}
          >
            font-{fontFamily}
          </h2>
          {Object.keys(fullConfig.theme.fontSize)
            .reverse()
            .map((fontSize, fontSizeIndex) => (
              <div key={fontSizeIndex}>
                <p
                  className={`cap-height-${fontSize} text-gray-900 bg-red-200 mb-4`}
                >{`text-${fontSize}`}</p>
                <p
                  className={`cap-height-${fontSize} line-gap-3 text-gray-900 bg-red-200 mb-4`}
                >{`text-${fontSize} line-gap-3`}</p>
                <p
                  className={`cap-height-${fontSize} line-gap-4 text-gray-900 bg-red-200 mb-4`}
                >{`text-${fontSize} line-gap-4`}</p>
                <p
                  className={`cap-height-${fontSize} line-gap-5 text-gray-900 bg-red-200 mb-4`}
                >{`text-${fontSize} line-gap-5`}</p>
              </div>
            ))}
        </div>
      ))}
    </section>
  )
}
