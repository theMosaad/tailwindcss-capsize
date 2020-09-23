import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../tailwind.config'

export default function FontSize() {
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
                  className={`text-${fontSize} text-gray-900 bg-red-200 mb-4`}
                >{`text-${fontSize}`}</p>
                <p
                  className={`text-${fontSize} leading-none text-gray-900 bg-red-200 mb-4`}
                >{`text-${fontSize} leading-none`}</p>
                <p
                  className={`text-${fontSize} leading-tight text-gray-900 bg-red-200 mb-4`}
                >{`text-${fontSize} leading-tight`}</p>
                <p
                  className={`text-${fontSize} leading-relaxed text-gray-900 bg-red-200 mb-4`}
                >{`text-${fontSize} leading-relaxed`}</p>
              </div>
            ))}
        </div>
      ))}
    </section>
  )
}
