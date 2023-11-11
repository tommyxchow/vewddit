import {
  SortOptions,
  TimeOptions,
  sortOptions,
  timeOptions,
} from '@/types/reddit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem } from './ui/form';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const formSchema = z.object({
  subreddit: z.string(),
});

export default function SearchBar() {
  const router = useRouter();

  const currentSubreddit = router.asPath.split('/')[2] ?? 'earthporn';

  const [sort, setSort] = useState<SortOptions>('Hot');
  const [time, setTime] = useState<TimeOptions>('Day');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (sort === 'Top') {
      router.push(
        `/r/${values.subreddit}/${sort.toLowerCase()}?t=${time.toLowerCase()}`,
      );
    } else {
      router.push(`/r/${values.subreddit}`);
    }
  }

  function onSortChange(sort: SortOptions) {
    setSort(sort);
    if (sort === 'Top') {
      router.push(
        `/r/${currentSubreddit}/${sort.toLowerCase()}?t=${time.toLowerCase()}`,
      );
    } else {
      router.push(`/r/${currentSubreddit}/${sort.toLowerCase()}`);
    }
  }

  function onTimeChange(time: TimeOptions) {
    setTime(time);
    router.push(
      `/r/${currentSubreddit}/${sort.toLowerCase()}?t=${time.toLowerCase()}`,
    );
  }

  return (
    <div className='flex flex-col gap-4 p-4'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex items-center gap-2'
        >
          <div className='grow'>
            <FormField
              control={form.control}
              name='subreddit'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className='rounded-lg border-2 bg-black'
                      aria-label='Subreddit name'
                      placeholder='earthporn'
                      type='search'
                      required
                      aria-describedby={undefined}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button type='submit'>Submit</Button>
        </form>
      </Form>

      <div className='z-50 flex items-baseline gap-2'>
        <h2 className='font-semibold'>
          <a
            className='hover:underline'
            target='_blank'
            href={`https://www.reddit.com/r/${currentSubreddit}`}
          >
            r/{currentSubreddit}
          </a>{' '}
        </h2>
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger className='w-24' defaultValue='hot'>
            <SelectValue placeholder='Sort' />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((sort) => (
              <SelectItem key={sort} value={sort}>
                {sort}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {sort === 'Top' && (
          <Select value={time} onValueChange={onTimeChange}>
            <SelectTrigger className='w-24'>
              <SelectValue placeholder='Time' />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem className='capitalize' key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
