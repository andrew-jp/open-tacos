import { MouseEventHandler, useCallback } from 'react'
import ContentLoader from 'react-content-loader'
import { basename } from 'path'
import Link from 'next/link'

import { MediaWithTags } from '../../js/types'
import ResponsiveImage from '../media/slideshow/ResponsiveImage'
import { DesktopPreviewLoader } from '../../js/sirv/util'
import RemoveImage from './RemoveImage'

interface UserMediaProps {
  uid: string
  index: number
  mediaWithTags: MediaWithTags
  onClick?: (props: any) => void
  isAuthorized?: boolean
}

/**
 * Wrapper for user uploaded photo (maybe a short video in the future)
 * @param onClick Desktop only callback.
 */
export default function UserMedia ({
  index,
  uid,
  mediaWithTags,
  onClick,
  isAuthorized = false
}: UserMediaProps): JSX.Element {
  const { mediaUrl, entityTags } = mediaWithTags
  const onClickHandler: MouseEventHandler = useCallback((event) => {
    if (onClick != null) {
      // we want to show URL in browser status bar and let the user open link in a new tab,
      // but we don't want the default behavoir of <a href...>
      event.preventDefault()
      event.stopPropagation()

      onClick({ mouseXY: [event.clientX, event.clientY], mediaWithTags, index })
    }
  }, [])

  const shareableUrl = `/p/${uid}/${basename(mediaUrl)}`

  const canRemoveImage = entityTags.length === 0 && isAuthorized
  return (
    <figure
      key={mediaUrl}
      className='block relative rounded-box overflow-hidden hover:shadow transition w-[300px] h-[300px] hover:brightness-75'

    >
      <Link href={shareableUrl}>
        <a onClick={onClickHandler}>
          <ResponsiveImage
            mediaUrl={mediaUrl}
            isHero={index === 0}
            isSquare
            loader={DesktopPreviewLoader}
          />
        </a>
      </Link>

      {canRemoveImage && (
        <div className='absolute top-0 right-0 p-1.5'>
          <RemoveImage imageInfo={mediaWithTags} />
        </div>
      )}
    </figure>
  )
}

export const ImagePlaceholder: React.FC<{ uniqueKey?: string }> = (props) => (
  <ContentLoader
    uniqueKey={props.uniqueKey}
    height={300}
    speed={0}
    backgroundColor='rgb(243 244 246)'
    viewBox='0 0 40 40'
  >
    <rect rx={0} ry={0} width='40' height='40' />
  </ContentLoader>
)
